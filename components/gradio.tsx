import React, { useEffect } from 'react';

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        title?: string;
        src?: string;
      };
    }
  }
}

export function GradioEmbed() {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://gradio.s3-us-west-2.amazonaws.com/5.0.2/gradio.js';
    
    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
      <div className="max-w-6xl mx-auto" style={{width: "min(900px, 95vw)", marginLeft: "min(-2.5vw, calc((100% - 900px)/2))"}}>
        <div className="bg-white rounded-lg shadow-lg">
          <gradio-app 
            title="gradio demo" 
            src="https://9dbc7a3dcce290201a.gradio.live"
          />
        </div>
      </div>
  );
};
