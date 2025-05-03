import React, { useEffect } from "react";

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gradio-app": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
        src?: string;
        theme?: string;
        class?: string;
        className?: string;
      };
    }
  }
}

export function GradioEmbed() {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.8.0/gradio.js";
    document.head.appendChild(script);

    let attempts = 0;
    const maxAttempts = 10;
    function fixClass() {
      const gradioApp = document.querySelector("gradio-app");
      if (gradioApp) {
        gradioApp.className = "light";
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(fixClass, 100);
      }
    }
    fixClass();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      className="max-w-6xl mx-auto"
      style={{
        width: "min(900px, 98vw)",
        marginLeft: "calc((100% - min(900px, 98vw)) / 2)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg">
        <gradio-app
          title="gradio demo"
          src="https://talkarena-green.williamheld.com/?__theme=light"
        />
      </div>
    </div>
  );
}
