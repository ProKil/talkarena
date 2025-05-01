import React from "react";

// Define the prop types interface
interface CAVAExampleProps {
  taskName: string;
  description: string;
  prompt: string;
  inputText: string;
  expectedOutput: string;
  audioUrl?: string;
  outputAudioUrl?: string;
  hasAudioOutput?: boolean;
}

// Simple component to display a CAVA benchmark task example
const CAVAExample: React.FC<CAVAExampleProps> = ({
  taskName,
  description,
  prompt,
  inputText,
  expectedOutput,
  audioUrl,
  outputAudioUrl,
  hasAudioOutput = false,
}) => {
  return (
    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{taskName}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="p-4 bg-white">
        {/* System Prompt */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">
            System Prompt:
          </div>
          <div
            className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {prompt.replace(/\n/g, "<br/>")}
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
          {inputText && (
            <div
              className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {inputText}
            </div>
          )}

          {/* Audio Player for Input */}
          {audioUrl && (
            <div className="mt-2">
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {/* Expected Output */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">
            Expected Output:
          </div>
          {expectedOutput && (
            <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800">
              {expectedOutput}
            </div>
          )}

          {/* Audio Player for Output (if applicable) */}
          {hasAudioOutput && outputAudioUrl && (
            <div className="mt-2">
              <audio controls className="w-full" src={outputAudioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CAVAExample;
