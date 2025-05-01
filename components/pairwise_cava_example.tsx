import React from 'react';

// Pairwise version of CAVAExample
interface PairwiseCAVAExampleProps {
  taskName: string;
  description: string;
  prompt: string;
  inputText: string;
  // Pairwise specific props
  expectedOutput1: string;
  expectedOutput2: string;
  audioUrl1?: string;
  audioUrl2?: string;
  outputAudioUrl1?: string;
  outputAudioUrl2?: string;
  hasAudioOutput?: boolean;
  label1?: string;
  label2?: string;
}

const PairwiseCAVAExample: React.FC<PairwiseCAVAExampleProps> = ({
  taskName,
  description,
  prompt,
  inputText,
  expectedOutput1,
  expectedOutput2,
  audioUrl1,
  audioUrl2,
  outputAudioUrl1,
  outputAudioUrl2,
  hasAudioOutput = false,
  label1 = "Example 1",
  label2 = "Example 2",
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
          {inputText && (
            <div
              className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {inputText}
            </div>
          )}
        </div>

        {/* Pairwise content */}
        <div className="flex flex-row justify-between space-x-6">
          {/* Left example */}
          <div className="w-6/12">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {label1}:
            </div>
            
            {/* Audio Player for Input 1 */}
            {audioUrl1 && (
              <div className="mb-3">
                <audio controls className="w-full" src={audioUrl1}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {/* Expected Output 1 */}
            {expectedOutput1 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
		    Expected Output In Response to {label1}:
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800">
                  {expectedOutput1}
                </div>
              </div>
            )}

            {/* Audio Player for Output 1 (if applicable) */}
            {hasAudioOutput && outputAudioUrl1 && (
              <div>
                <audio controls className="w-full" src={outputAudioUrl1}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          
          {/* Right example */}
          <div className="w-6/12">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {label2}:
            </div>
            
            {/* Audio Player for Input 2 */}
            {audioUrl2 && (
              <div className="mb-3">
                <audio controls className="w-full" src={audioUrl2}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {/* Expected Output 2 */}
            {expectedOutput2 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Expected Output In Response to {label2}:
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800">
                  {expectedOutput2}
                </div>
              </div>
            )}

            {/* Audio Player for Output 2 (if applicable) */}
            {hasAudioOutput && outputAudioUrl2 && (
              <div>
                <audio controls className="w-full" src={outputAudioUrl2}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairwiseCAVAExample;
