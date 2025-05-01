import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableData = {
  cognitiveState: [
    {
      task: "Humor Detection",
      dataset: "URFUNNY",
      size: "994",
      link: "https://aclanthology.org/D19-1211/",
    },
    {
      task: "Sarcasm Detection",
      dataset: "MUSTARD",
      size: "690",
      link: "https://aclanthology.org/P19-1455/",
    },
    {
      task: "Pragmatic Intent Detection",
      dataset: "SLURP",
      size: "753",
      link: "https://aclanthology.org/2020.emnlp-main.588/",
    },
    {
      task: "Emotion Recognition",
      dataset: "IEMOCAP",
      size: "1023",
      link: "https://sail.usc.edu/iemocap/Busso_2008_iemocap.pdf",
    },
    {
      task: "Emotion Recognition",
      dataset: "MELD",
      size: "2608",
      link: "https://arxiv.org/abs/1810.02508",
    },
  ],
  speakerIdentity: [
    {
      task: "Language Identification",
      dataset: "Covost2-lan",
      size: "1000",
      link: "https://arxiv.org/abs/2402.07729",
    },
    {
      task: "Gender Classification",
      dataset: "Commonvoice",
      size: "1258",
      link: "https://arxiv.org/abs/1912.06670",
    },
    {
      task: "Age Classification",
      dataset: "FairSpeech",
      size: "1000",
      link: "https://arxiv.org/abs/2408.12734",
    },
    {
      task: "Age Classification",
      dataset: "Commonvoice",
      size: "1258",
      link: "https://arxiv.org/abs/1912.06670",
    },
    {
      task: "Gender Classification",
      dataset: "FairSpeech",
      size: "1000",
      link: "https://arxiv.org/abs/2408.12734",
    },
    {
      task: "Accent Classification",
      dataset: "Commonvoice",
      size: "1086",
      link: "https://arxiv.org/abs/1912.06670",
    },
  ],
  speechContent: [
    {
      task: "Speech Grounding",
      dataset: "Librispeech-grounding",
      size: "1000",
      link: "https://arxiv.org/abs/2402.07729",
    },
    {
      task: "Speech Entity Recognition",
      dataset: "SLURP-ent",
      size: "1000",
      link: "https://arxiv.org/abs/2402.07729",
    },
    {
      task: "Instruction Following",
      dataset: "Alpaca-Audio",
      size: "100",
      link: "https://arxiv.org/abs/2406.16020",
    },
    {
      task: "Instruction Following",
      dataset: "Openhermes-Audio",
      size: "100",
      link: "https://huggingface.co/datasets/teknium/OpenHermes-2.5",
    },
    {
      task: "Speech QA",
      dataset: "CN-College-Listen",
      size: "2271",
      link: "https://arxiv.org/abs/2406.16020",
    },
    {
      task: "Speech QA",
      dataset: "Public_sg_speech",
      size: "688",
      link: "https://arxiv.org/abs/2406.16020",
    },
  ],
  relationshipData: [
    {
      task: "Relationship Classification",
      dataset: "CallHome",
      size: "24",
      link: "https://arxiv.org/abs/1912.06670",
    },
  ],
};

export function ResearchTable() {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-center font-bold">Category</TableHead>
            <TableHead className="text-center font-bold">Task</TableHead>
            <TableHead className="text-center font-bold">Dataset</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
            <TableHead className="text-center font-bold">Category</TableHead>
            <TableHead className="text-center font-bold">Task</TableHead>
            <TableHead className="text-center font-bold">Dataset</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
            <TableHead className="text-center font-bold">Category</TableHead>
            <TableHead className="text-center font-bold">Task</TableHead>
            <TableHead className="text-center font-bold">Dataset</TableHead>
            <TableHead className="text-center font-bold">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.cognitiveState.map((item, index) => (
            <TableRow key={`cognitive-${index}`} className="hover:bg-muted/50">
              {index === 0 && (
                <TableCell
                  rowSpan={5}
                  className="text-center align-middle font-semibold bg-muted/30"
                >
                  Cognitive State
                </TableCell>
              )}
              <TableCell className="text-center">{item.task}</TableCell>
              <TableCell className="text-center">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {item.dataset}
                </a>
              </TableCell>
              <TableCell className="text-center">{item.size}</TableCell>
              {index === 0 && (
                <TableCell
                  rowSpan={6}
                  className="text-center align-middle font-semibold bg-muted/30"
                >
                  Speaker Identity
                </TableCell>
              )}
              {tableData.speakerIdentity[index] && (
                <>
                  <TableCell className="text-center">
                    {tableData.speakerIdentity[index].task}
                  </TableCell>
                  <TableCell className="text-center">
                    <a
                      href={tableData.speakerIdentity[index].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {tableData.speakerIdentity[index].dataset}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {tableData.speakerIdentity[index].size}
                  </TableCell>
                </>
              )}
              {index === 0 && (
                <TableCell
                  rowSpan={6}
                  className="text-center align-middle font-semibold bg-muted/30"
                >
                  Speech Content
                </TableCell>
              )}
              {tableData.speechContent[index] && (
                <>
                  <TableCell className="text-center">
                    {tableData.speechContent[index].task}
                  </TableCell>
                  <TableCell className="text-center">
                    <a
                      href={tableData.speechContent[index].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {tableData.speechContent[index].dataset}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {tableData.speechContent[index].size}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}

          <TableRow className="hover:bg-muted/50">
            <TableCell className="text-center align-middle font-semibold bg-muted/30">
              Relationship
            </TableCell>
            <TableCell className="text-center">
              {tableData.relationshipData[0].task}
            </TableCell>
            <TableCell className="text-center">
              <a
                href={tableData.relationshipData[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {tableData.relationshipData[0].dataset}
              </a>
            </TableCell>
            <TableCell className="text-center">
              {tableData.relationshipData[0].size}
            </TableCell>
            <TableCell className="text-center">
              {tableData.speakerIdentity[5].task}
            </TableCell>
            <TableCell className="text-center">
              <a
                href={tableData.speakerIdentity[5].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {tableData.speakerIdentity[5].dataset}
              </a>
            </TableCell>
            <TableCell className="text-center">
              {tableData.speakerIdentity[5].size}
            </TableCell>
            <TableCell className="text-center">
              {tableData.speechContent[5].task}
            </TableCell>
            <TableCell className="text-center">
              <a
                href={tableData.speechContent[5].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {tableData.speechContent[5].dataset}
              </a>
            </TableCell>
            <TableCell className="text-center">
              {tableData.speechContent[5].size}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ResearchTable;
