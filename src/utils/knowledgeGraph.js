/**
 * Knowledge Graph Utility
 * 
 * This utility provides functions to retrieve and format content
 * from the Knowledge Graph for use in the website.
 */

/**
 * Fetches all entities of a specific type from the Knowledge Graph
 * @param {string} entityType - The type of entities to fetch (e.g., 'Project', 'Service')
 * @returns {Promise<Array>} - Array of entities
 */
export async function getEntitiesByType(entityType) {
  try {
    // In a real implementation, this would make an API call to the Knowledge Graph
    // For now, we'll simulate the response with mock data
    
    // This is where you would normally fetch from an API endpoint
    // const response = await fetch(`/api/knowledge-graph/entities?type=${entityType}`);
    // const data = await response.json();
    // return data;
    
    // For demonstration purposes, we'll return mock data based on the entity type
    return getMockEntitiesByType(entityType);
  } catch (error) {
    console.error(`Error fetching ${entityType} entities:`, error);
    return [];
  }
}

/**
 * Fetches an entity by name from the Knowledge Graph
 * @param {string} entityName - The name of the entity to fetch
 * @returns {Promise<Object|null>} - The entity object or null if not found
 */
export async function getEntityByName(entityName) {
  try {
    // In a real implementation, this would make an API call to the Knowledge Graph
    // For now, we'll simulate the response with mock data
    
    // This is where you would normally fetch from an API endpoint
    // const response = await fetch(`/api/knowledge-graph/entities/${encodeURIComponent(entityName)}`);
    // const data = await response.json();
    // return data;
    
    // For demonstration purposes, we'll return mock data based on the entity name
    return getMockEntityByName(entityName);
  } catch (error) {
    console.error(`Error fetching entity ${entityName}:`, error);
    return null;
  }
}

/**
 * Fetches all entities related to a specific entity from the Knowledge Graph
 * @param {string} entityName - The name of the entity to find relations for
 * @param {string} relationType - Optional relation type to filter by
 * @returns {Promise<Array>} - Array of related entities
 */
export async function getRelatedEntities(entityName, relationType = null) {
  try {
    // In a real implementation, this would make an API call to the Knowledge Graph
    // For now, we'll simulate the response with mock data
    
    // This is where you would normally fetch from an API endpoint
    // const url = relationType 
    //   ? `/api/knowledge-graph/relations?entity=${encodeURIComponent(entityName)}&type=${relationType}`
    //   : `/api/knowledge-graph/relations?entity=${encodeURIComponent(entityName)}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data;
    
    // For demonstration purposes, we'll return mock data based on the entity name and relation type
    return getMockRelatedEntities(entityName, relationType);
  } catch (error) {
    console.error(`Error fetching relations for ${entityName}:`, error);
    return [];
  }
}

/**
 * Formats entity observations into HTML content
 * @param {Object} entity - The entity object with observations
 * @returns {string} - HTML content
 */
export function formatEntityContent(entity) {
  if (!entity || !entity.observations || !entity.observations.length) {
    return '<p>No content available.</p>';
  }
  
  return entity.observations
    .map(observation => `<p>${observation}</p>`)
    .join('');
}

// Mock data functions for demonstration purposes
// In a real implementation, these would be replaced with actual API calls

function getMockEntitiesByType(entityType) {
  const mockData = {
    'Project': [
      {
        name: 'NosytOS95',
        entityType: 'Project',
        observations: [
          'A Windows 95-inspired web interface with resizable windows and functional applications.',
          'Features include enhanced terminal commands and in-depth help documentation with Easter eggs.',
          'Includes a fully functional Duck Hunt game with sound effects and high score tracking.',
          'Applications include Notepad and Nosyt AI with proper window management.'
        ]
      },
      {
        name: 'Dev Toolkit',
        entityType: 'Project',
        observations: [
          'A collection of utilities to streamline development workflows.',
          'Includes code snippets, documentation templates, and productivity tools for common programming tasks.',
          'Currently in active development with regular updates.',
          'Available on GitHub at https://github.com/NosytLabs/dev-toolkit.'
        ]
      },
      {
        name: 'Mining Dashboard',
        entityType: 'Project',
        observations: [
          'A monitoring dashboard for cryptocurrency miners.',
          'Tracks hashrate, power consumption, temperature, and profitability metrics.',
          'Helps miners optimize their operations and monitor equipment health.',
          'Beta version available for testing at https://github.com/NosytLabs/mining-dashboard.'
        ]
      },
      {
        name: 'Stream Helper',
        entityType: 'Project',
        observations: [
          'A basic streaming toolkit for content creators on platforms like Kick.com and YouTube.',
          'Includes customizable overlays, alerts, and chat integration.',
          'Used in streams on Kick.com/Tycen.',
          'Available on GitHub at https://github.com/NosytLabs/stream-helper.'
        ]
      }
    ],
    'Service': [
      {
        name: 'Web Development',
        entityType: 'Service',
        observations: [
          'Custom websites and web applications built with React, Astro, and modern frameworks.',
          'Specializing in responsive design, performance optimization, and SEO.',
          'Services include front-end development, back-end development, and full-stack solutions.',
          'Projects are showcased on GitHub under the NosytLabs organization.'
        ]
      },
      {
        name: 'Content Creation',
        entityType: 'Service',
        observations: [
          'Technology and programming content on YouTube (@TycenYT).',
          'Live streaming on Kick.com/Tycen featuring coding tutorials, tech reviews, and AI tools.',
          'Content focuses on educational resources about technology, programming, and digital tools.',
          'Includes tutorials, reviews, and demonstrations of various technologies.'
        ]
      },
      {
        name: '3D Printing',
        entityType: 'Service',
        observations: [
          'Custom 3D printing services using Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin) printers.',
          'Services include prototypes, models, and functional parts.',
          '3D models are showcased on crealitycloud.com/user/9519489699.',
          'Plans to open an Etsy store for 3D printing services.'
        ]
      },
      {
        name: 'Passive Income',
        entityType: 'Service',
        observations: [
          'Educational resources about passive income opportunities.',
          'Includes bandwidth sharing, content creation, and investments with realistic earnings expectations.',
          'Features apps like HoneyGain, EarnApp, and Repocket displayed as cards with authentic earnings data.',
          'Focuses on authentic content with factual information, without exaggerated earnings claims.'
        ]
      }
    ],
    'BlogPost': [
      {
        name: 'Cursor AI Blog',
        entityType: 'BlogPost',
        observations: [
          'Cursor AI is a code editor with AI capabilities.',
          'It helps developers write, understand, and debug code faster.',
          'Features include code completion, explanation, and refactoring.',
          'The blog post discusses how to use Cursor AI effectively for development projects.'
        ]
      },
      {
        name: 'Trae AI',
        entityType: 'BlogPost',
        observations: [
          'Trae AI is an AI assistant for developers.',
          'It helps with code generation, debugging, and documentation.',
          'The blog post explores how Trae AI can improve development workflows.',
          'It compares Trae AI with other AI coding assistants.'
        ]
      },
      {
        name: 'Roo Code',
        entityType: 'BlogPost',
        observations: [
          'Roo Code is a collaborative coding platform with AI features.',
          'It allows teams to work together on code with AI assistance.',
          'The blog post discusses how Roo Code can improve team productivity.',
          'It provides tips for integrating Roo Code into existing development workflows.'
        ]
      },
      {
        name: 'Windsurf Blog',
        entityType: 'BlogPost',
        observations: [
          'Windsurf is a framework for building AI-powered applications.',
          'It simplifies the process of integrating AI capabilities into web applications.',
          'The blog post explores how to use Windsurf for various AI-powered features.',
          'It includes code examples and best practices for Windsurf implementation.'
        ]
      }
    ],
    'PassiveIncomeApp': [
      {
        name: 'HoneyGain',
        entityType: 'PassiveIncomeApp',
        observations: [
          'HoneyGain is a passive income app that pays users for sharing their internet bandwidth.',
          'Users can earn around $20-30 per month depending on usage and location.',
          'The app runs in the background and doesn\'t significantly impact internet performance.',
          'Payments are made via PayPal or cryptocurrency.'
        ]
      },
      {
        name: 'EarnApp',
        entityType: 'PassiveIncomeApp',
        observations: [
          'EarnApp is a passive income app that pays users for sharing their internet bandwidth.',
          'Users can earn around $5-15 per month depending on usage and location.',
          'The app is lightweight and runs in the background on various devices.',
          'Payments are made via PayPal.'
        ]
      },
      {
        name: 'Repocket',
        entityType: 'PassiveIncomeApp',
        observations: [
          'Repocket is a passive income app that pays users for sharing their internet bandwidth.',
          'Users can earn around $10-20 per month depending on usage and location.',
          'The app supports multiple devices and has a user-friendly dashboard.',
          'Payments are made via PayPal or cryptocurrency.'
        ]
      }
    ]
  };
  
  return Promise.resolve(mockData[entityType] || []);
}

function getMockEntityByName(entityName) {
  // Combine all mock entities into a single array
  const allEntities = [
    ...getMockEntitiesByType('Project'),
    ...getMockEntitiesByType('Service'),
    ...getMockEntitiesByType('BlogPost'),
    ...getMockEntitiesByType('PassiveIncomeApp')
  ];
  
  // Find the entity by name
  const entity = allEntities.find(e => e.name === entityName);
  
  return Promise.resolve(entity || null);
}

function getMockRelatedEntities(entityName, relationType) {
  const mockRelations = {
    'NosytLabs': {
      'offers': ['Web Development', 'Content Creation', '3D Printing', 'Passive Income'],
      'develops': ['NosytOS95', 'Dev Toolkit', 'Mining Dashboard', 'Stream Helper'],
      'publishes': ['Cursor AI Blog', 'Trae AI', 'Roo Code', 'Windsurf Blog']
    },
    'Web Development': {
      'relates to': ['Dev Toolkit', 'Cursor AI Blog', 'Trae AI', 'Roo Code', 'Windsurf Blog']
    },
    'Content Creation': {
      'uses': ['Stream Helper']
    },
    'Passive Income': {
      'relates to': ['Mining Dashboard'],
      'features': ['HoneyGain', 'EarnApp', 'Repocket']
    }
  };
  
  if (!mockRelations[entityName]) {
    return Promise.resolve([]);
  }
  
  if (relationType && mockRelations[entityName][relationType]) {
    // Return entities with the specified relation type
    return Promise.all(
      mockRelations[entityName][relationType].map(name => getMockEntityByName(name))
    );
  } else {
    // Return all related entities
    return Promise.all(
      Object.values(mockRelations[entityName])
        .flat()
        .map(name => getMockEntityByName(name))
    );
  }
}
