import React from 'react';

const tableData = {
  cognitiveState: [
    { task: "Humor Detection", dataset: "URFUNNY", size: "994", link: "https://aclanthology.org/D19-1211/" },
    { task: "Sarcasm Detection", dataset: "MUSTARD", size: "690", link: "https://aclanthology.org/P19-1455/" },
    { task: "Pragmatic Intent Detection", dataset: "SLURP", size: "753", link: "https://aclanthology.org/2020.emnlp-main.588/" },
    { task: "Emotion Recognition", dataset: "IEMOCAP", size: "1023", link: "https://sail.usc.edu/iemocap/Busso_2008_iemocap.pdf" },
    { task: "Emotion Recognition", dataset: "MELD", size: "2608", link: "https://arxiv.org/abs/1810.02508" }
  ],
  speakerIdentity: [
    { task: "Language Identification", dataset: "Covost2-lan", size: "1000", link: "https://arxiv.org/abs/2402.07729" },
    { task: "Gender Classification", dataset: "Commonvoice", size: "1258", link: "https://arxiv.org/abs/1912.06670" },
    { task: "Age Classification", dataset: "FairSpeech", size: "1000", link: "https://arxiv.org/abs/2408.12734" },
    { task: "Age Classification", dataset: "Commonvoice", size: "1258", link: "https://arxiv.org/abs/1912.06670" },
    { task: "Gender Classification", dataset: "FairSpeech", size: "1000", link: "https://arxiv.org/abs/2408.12734" },
    { task: "Accent Classification", dataset: "Commonvoice", size: "1086", link: "https://arxiv.org/abs/1912.06670" }
  ],
  speechContent: [
    { task: "Speech Grounding", dataset: "Librispeech-grounding", size: "1000", link: "https://arxiv.org/abs/2402.07729" },
    { task: "Speech Entity Recognition", dataset: "SLURP-ent", size: "1000", link: "https://arxiv.org/abs/2402.07729" },
    { task: "Instruction Following", dataset: "Alpaca-Audio", size: "100", link: "https://arxiv.org/abs/2406.16020" },
    { task: "Instruction Following", dataset: "Openhermes-Audio", size: "100", link: "https://huggingface.co/datasets/teknium/OpenHermes-2.5" },
    { task: "Speech QA", dataset: "CN-College-Listen", size: "2271", link: "https://arxiv.org/abs/2406.16020" },
    { task: "Speech QA", dataset: "Public_sg_speech", size: "688", link: "https://arxiv.org/abs/2406.16020" }
  ],
  relationshipData: [
    { task: "Relationship Classification", dataset: "CallHome", size: "24", link: "https://arxiv.org/abs/1912.06670" }
  ]
};

export function ResearchTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border font-bold text-center">Category</th>
            <th className="p-2 border font-bold text-center">Task</th>
            <th className="p-2 border font-bold text-center">Dataset</th>
            <th className="p-2 border font-bold text-center">Size</th>
            <th className="p-2 border font-bold text-center">Category</th>
            <th className="p-2 border font-bold text-center">Task</th>
            <th className="p-2 border font-bold text-center">Dataset</th>
            <th className="p-2 border font-bold text-center">Size</th>
            <th className="p-2 border font-bold text-center">Category</th>
            <th className="p-2 border font-bold text-center">Task</th>
            <th className="p-2 border font-bold text-center">Dataset</th>
            <th className="p-2 border font-bold text-center">Size</th>
          </tr>
        </thead>
        <tbody>
          {/* First 5 rows for Cognitive State */}
          {tableData.cognitiveState.map((item, index) => (
            <tr key={`cognitive-${index}`} className="bg-gray-50">
              {index === 0 && (
                <td rowSpan={5} className="p-2 border font-bold text-center align-middle bg-gray-50">
                  Cognitive State
                </td>
              )}
              <td className="p-2 border text-center">{item.task}</td>
              <td className="p-2 border text-center">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {item.dataset}
                </a>
              </td>
              <td className="p-2 border text-center">{item.size}</td>
              {index === 0 && (
                <td rowSpan={6} className="p-2 border font-bold text-center align-middle bg-gray-50">
                  Speaker Identity
                </td>
              )}
              {tableData.speakerIdentity[index] && (
                <>
                  <td className="p-2 border text-center">{tableData.speakerIdentity[index].task}</td>
                  <td className="p-2 border text-center">
                    <a href={tableData.speakerIdentity[index].link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {tableData.speakerIdentity[index].dataset}
                    </a>
                  </td>
                  <td className="p-2 border text-center">{tableData.speakerIdentity[index].size}</td>
                </>
              )}
              {index === 0 && (
                <td rowSpan={6} className="p-2 border font-bold text-center align-middle bg-gray-50">
                  Speech Content
                </td>
              )}
              {tableData.speechContent[index] && (
                <>
                  <td className="p-2 border text-center">{tableData.speechContent[index].task}</td>
                  <td className="p-2 border text-center">
                    <a href={tableData.speechContent[index].link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {tableData.speechContent[index].dataset}
                    </a>
                  </td>
                  <td className="p-2 border text-center">{tableData.speechContent[index].size}</td>
                </>
              )}
            </tr>
          ))}
          
          {/* Relationship Classification row */}
          <tr className="bg-gray-50">
            <td className="p-2 border font-bold text-center align-middle bg-gray-50">
              Speaker Identity
            </td>
            <td className="p-2 border text-center">{tableData.relationshipData[0].task}</td>
            <td className="p-2 border text-center">
              <a href={tableData.relationshipData[0].link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tableData.relationshipData[0].dataset}
              </a>
            </td>
            <td className="p-2 border text-center">{tableData.relationshipData[0].size}</td>
            {/* Complete the row with Speaker Identity and Speech Content data */}
            <td className="p-2 border text-center">{tableData.speakerIdentity[5].task}</td>
            <td className="p-2 border text-center">
              <a href={tableData.speakerIdentity[5].link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tableData.speakerIdentity[5].dataset}
              </a>
            </td>
            <td className="p-2 border text-center">{tableData.speakerIdentity[5].size}</td>
            <td className="p-2 border text-center">{tableData.speechContent[5].task}</td>
            <td className="p-2 border text-center">
              <a href={tableData.speechContent[5].link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tableData.speechContent[5].dataset}
              </a>
            </td>
            <td className="p-2 border text-center">{tableData.speechContent[5].size}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}