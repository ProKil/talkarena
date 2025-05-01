import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function IrbRubricsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          How should I evaluate the models' output?
        </AccordionTrigger>
        <AccordionContent>
          Please select the response which is better among the two candidates by
          considering the following dimensions:
          <ul className="list-disc list-inside">
            <li>
              {" "}
              Naturalness: Evaluates how closely the response resembles human
              language, focusing on fluency, grammar, and appropriate tone to
              ensure it sounds natural.
            </li>
            <li>
              {" "}
              Coherence: Assesses the logical flow and clarity of ideas,
              ensuring that each part of the response contributes meaningfully
              and is internally consistent.
            </li>
            <li>
              {" "}
              Groundedness: Ensure the response is related to the input and is
              based on accurate, reliable information, avoiding unsupported or
              speculative statements to enhance credibility.
            </li>
            <li>
              {" "}
              Harmlessness: Choose the response that sounds most similar to what
              a peaceful, ethical, and respectful person would say.
            </li>
            <li>
              {" "}
              Helpfulness: Choose the response that has the most actionable
              information relevant to the inputs provided or which most
              completely follows the instructions given.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Does this platform store my data?</AccordionTrigger>
        <AccordionContent>
          This public platform does not store any information about you or your
          queries for further research or release. All recordings of what you
          said are erased after you submit your votes and vote data are stored
          to understand model performance, but no information about your
          requests is stored. The public platform sends data to third-party APIs
          from OpenAI and Google. In both cases, we utilize paid APIs for which
          the terms of service dictate that your data will not be used for
          training or stored for more than 30 days. Based on the lack of
          identifiable information and the focus on model rankings, the Stanford
          IRB has determined that this public platform is not human subects
          research as defined in 45 CFR 46.102(e).
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Why Audio-In, Text-Out evaluation rather than Audio-In, Audio-Out?
        </AccordionTrigger>
        <AccordionContent>
          As discussed in our{" "}
          <a href="https://talkarena.org/blog/looking_forward">
            Looking Forward
          </a>{" "}
          section, we plan to extend Talk Arena to include conversational AI
          similar to advanced voice models. However, spoken conversations
          present challenges for traditional arena-style evaluations:
          <ul className="list-disc list-inside">
            <li>
              1) Voice model outputs are inherently identifiable, which breaks
              the "anonymity" constraints of most arenas.
            </li>
            <li>
              2) The fluidity of spoken conversations makes simultaneous
              comparison difficult - you can't listen to two speech streams at
              once or interrupt both simultaneously.
            </li>
          </ul>
          Additionally, practical considerations make Audio-Input, Text-Output
          evaluation worthwhile currently:
          <ul className="list-disc list-inside">
            <li>
              1) Audio-Input, Text-Output language models are more prevalent,
              providing enough capable models for meaningful Arena rankings.
            </li>
            <li>
              2) Audio-Input, Text-Output evaluations have more established
              benchmarks. For models handling both audio input and output,
              focusing on high-quality static evaluations and metrics is likely
              the better investment now.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Ethics disclosure</AccordionTrigger>
        <AccordionContent>
          This study has been approved by the Institutional Review Board (IRB)
          at the researchers' institution, and we obtained participant consent
          with a standard institutional consent form. For the Prolific study, we
          stored users queries as well as rationale about why they picked their
          votes. While our focus is on understanding model behaviours that are
          desirable, doing this analysis required storing this personally
          identifiable information. As such, this study was approved under
          Expedited Review Categories 6 and 7 for the collection of voice for
          research purposes and research employing survey methods. All
          participants were paid 15 dollars an hour on the prolific platform.
          <br />
          Questions: If you have any questions, concerns or complaints about
          this research, its procedures, risks and benefits, contact the Diyi
          Yang, diyiy@cs.stanford.edu. Independent Contact: If you are not
          satisfied with how this study is being conducted, or if you have any
          concerns, complaints, or general questions about the research or your
          rights as a participant, please contact the Stanford Institutional
          Review Board (IRB) to speak to someone independent of the research
          team at 650-723-2480 or toll free at 1-866-680-2906, or email at
          irbnonmed@stanford.edu. You can also write to the Stanford IRB,
          Stanford University, 1705 El Camino Real, Palo Alto, CA 94306.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
