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
    script.src = 'https://gradio.s3-us-west-2.amazonaws.com/5.8.0/gradio.js';
    
    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
      <div className="max-w-6xl mx-auto" style={{width: "min(900px, 98vw)", marginLeft: "calc((100% - min(900px, 98vw)) / 2)"}}>
        <div className="bg-white rounded-lg shadow-lg">
          <gradio-app 
            title="gradio demo" 
            src="https://551e8984a9b6a26ad2.gradio.live"
          />
        </div>
      </div>
  );
};
