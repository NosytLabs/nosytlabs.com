// Simple test component to verify React components work
export default function TestComponent() {
  console.log('🟢 TEST COMPONENT: Simple React component is executing!');
  
  return (
    <div style={{ 
      background: 'red', 
      color: 'white', 
      padding: '20px', 
      margin: '20px',
      textAlign: 'center' as const
    }}>
      <h3>TEST COMPONENT RENDERED SUCCESSFULLY</h3>
      <p>If you see this, React components are working!</p>
    </div>
  );
}