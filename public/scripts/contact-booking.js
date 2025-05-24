// State management
const state = {
    selectedDate: null,
    selectedTimeSlot: null,
    uploadedFiles: new Set(),
    serviceFields: {
        web: ['framework', 'hosting', 'maintenance'],
        mobile: ['platform', 'stores', 'features'],
        consulting: ['industry', 'scope', 'duration'],
        design: ['brand', 'deliverables', 'style']
    }
};

// DOM Elements
const elements = {
    tabs: document.querySelectorAll('.tab-btn'),
    forms: document.querySelectorAll('.form'),
    contactForm: document.getElementById('contactForm'),
    bookingForm: document.getElementById('bookingForm'),
    serviceSelect: document.getElementById('service'),
    budgetRange: document.getElementById('budget'),
    budgetValue: document.getElementById('budgetValue'),
    fileInput: document.getElementById('file'),
    fileList: document.getElementById('fileList'),
    calendar: document.getElementById('calendar'),
    timeSlots: document.getElementById('timeSlots'),
    notifications: document.getElementById('notifications')
};

// Tab Switching
elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        
        // Update active states
        elements.tabs.forEach(t => t.classList.remove('active'));
        elements.forms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetId === 'contact' ? 'contactForm' : 'bookingSystem').classList.add('active');
    });
});

// Dynamic Service Fields
elements.serviceSelect.addEventListener('change', (e) => {
    const service = e.target.value;
    const existingFields = document.querySelector('.dynamic-fields');
    
    if (existingFields) {
        existingFields.remove();
    }
    
    if (service && state.serviceFields[service]) {
        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = 'dynamic-fields';
        
        state.serviceFields[service].forEach(field => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            
            fieldGroup.innerHTML = `
                <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type="text" id="${field}" name="${field}" required>
            `;
            
            fieldsContainer.appendChild(fieldGroup);
        });
        
        elements.serviceSelect.parentNode.after(fieldsContainer);
    }
});

// Budget Range Handler
elements.budgetRange.addEventListener('input', (e) => {
    elements.budgetValue.textContent = `$${parseInt(e.target.value).toLocaleString()}`;
});

// File Upload Handler
elements.fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (state.uploadedFiles.has(file.name)) {
            showNotification('File already added', 'error');
            return;
        }
        
        state.uploadedFiles.add(file.name);
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
            <span>${file.name}</span>
            <button type="button" data-file="${file.name}">&times;</button>
        `;
        
        fileElement.querySelector('button').addEventListener('click', () => {
            state.uploadedFiles.delete(file.name);
            fileElement.remove();
        });
        
        elements.fileList.appendChild(fileElement);
    });
});

// Calendar Implementation
class Calendar {
    constructor(element) {
        this.element = element;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.render();
        this.attachEventListeners();
    }
    
    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const calendar = document.createElement('div');
        calendar.className = 'calendar-grid';
        
        // Calendar header
        calendar.innerHTML = `
            <div class="calendar-header">
                <button class="prev-month">&lt;</button>
                <h3>${new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button class="next-month">&gt;</button>
            </div>
            <div class="calendar-days">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    .map(day => `<div class="day-name">${day}</div>`).join('')}
            </div>
        `;
        
        // Calendar grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';
        
        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            daysGrid.appendChild(document.createElement('div'));
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const date = new Date(year, month, day);
            if (date < new Date().setHours(0, 0, 0, 0)) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.classList.add('available');
                dayElement.dataset.date = date.toISOString();
            }
            
            if (this.selectedDate && date.toDateString() === this.selectedDate.toDateString()) {
                dayElement.classList.add('selected');
            }
            
            daysGrid.appendChild(dayElement);
        }
        
        calendar.appendChild(daysGrid);
        this.element.innerHTML = '';
        this.element.appendChild(calendar);
    }
    
    attachEventListeners() {
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('prev-month')) {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            } else if (e.target.classList.contains('next-month')) {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            } else if (e.target.classList.contains('available')) {
                const selectedDate = new Date(e.target.dataset.date);
                this.selectedDate = selectedDate;
                state.selectedDate = selectedDate;
                this.render();
                generateTimeSlots(selectedDate);
            }
        });
    }
}

// Generate Time Slots
function generateTimeSlots(date) {
    const slotsContainer = elements.timeSlots.querySelector('.slots-container');
    slotsContainer.innerHTML = '';
    
    // Generate slots between 9 AM and 5 PM
    for (let hour = 9; hour < 17; hour++) {
        for (let minute of ['00', '30']) {
            const slot = document.createElement('button');
            slot.type = 'button';
            slot.className = 'slot-btn';
            slot.textContent = `${hour}:${minute}`;
            
            slot.addEventListener('click', () => {
                document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('selected'));
                slot.classList.add('selected');
                state.selectedTimeSlot = `${hour}:${minute}`;
            });
            
            slotsContainer.appendChild(slot);
        }
    }
}

// Form Validation and Submission
function validateForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    for (let [key, value] of Object.entries(data)) {
        if (value.trim() === '' && form.elements[key].hasAttribute('required')) {
            showNotification(`Please fill in ${key.replace('_', ' ')}`, 'error');
            return false;
        }
    }
    
    return true;
}

// Contact Form Submission
elements.contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm(e.target)) return;
    
    const formData = new FormData(e.target);
    
    try {
        e.target.classList.add('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Form submitted successfully!', 'success');
        e.target.reset();
        state.uploadedFiles.clear();
        elements.fileList.innerHTML = '';
        
    } catch (error) {
        showNotification('Error submitting form. Please try again.', 'error');
    } finally {
        e.target.classList.remove('loading');
    }
});

// Booking Form Submission
elements.bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!state.selectedDate || !state.selectedTimeSlot) {
        showNotification('Please select a date and time slot', 'error');
        return;
    }
    
    if (!validateForm(e.target)) return;
    
    const formData = new FormData(e.target);
    
    try {
        e.target.classList.add('loading');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Booking confirmed!', 'success');
        e.target.reset();
        state.selectedDate = null;
        state.selectedTimeSlot = null;
        
        // Reset calendar
        new Calendar(elements.calendar);
        elements.timeSlots.querySelector('.slots-container').innerHTML = '';
        
    } catch (error) {
        showNotification('Error confirming booking. Please try again.', 'error');
    } finally {
        e.target.classList.remove('loading');
    }
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize Calendar
new Calendar(elements.calendar);