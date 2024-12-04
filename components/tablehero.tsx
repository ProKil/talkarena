export function TableHero() {
    return (
        <><div style="text-align: center;">
            <style type="text/css">
            .tg  {border-collapse:collapse;border-spacing:0;}
            .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
            overflow:hidden;padding:10px 5px;word-break:normal;}
            .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
            font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
            .tg .tg-jz12{background-color:#efefef;border-color:inherit;color:#333333;text-align:center;vertical-align:middle}
            .tg .tg-yj5y{background-color:#efefef;border-color:inherit;text-align:center;vertical-align:top}
            .tg .tg-34fe{background-color:#c0c0c0;border-color:inherit;text-align:center;vertical-align:top}
            .tg .tg-zlqz{background-color:#c0c0c0;border-color:inherit;font-weight:bold;text-align:center;vertical-align:top}
            .tg .tg-qbk9{background-color:#efefef;border-color:inherit;font-weight:bold;text-align:center;vertical-align:middle}
            </style>
            <table class="tg"><thead>
            <tr>
                <th class="tg-34fe"><span style="font-weight:bold">Category</span></th>
                <th class="tg-34fe"><span style="font-weight:bold">Task</span></th>
                <th class="tg-34fe"><span style="font-weight:bold">Dataset</span></th>
                <th class="tg-34fe"><span style="font-weight:bold">Size</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Category</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Task</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Dataset</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Size</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Category</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Task</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Dataset</span></th>
                <th class="tg-zlqz"><span style="font-weight:bold">Size</span></th>
            </tr></thead>
            <tbody>
            <tr>
                <td class="tg-qbk9" rowspan="5">Cognitive State</td>
                <td class="tg-yj5y"><span style="color:black">Humor Detection</span></td>
                <td class="tg-yj5y"><a href="https://aclanthology.org/D19-1211/" target="_blank" rel="noopener noreferrer">URFUNNY</a></td>
                <td class="tg-yj5y">994</td>
                <td class="tg-jz12" rowspan="6"><span style="font-weight:bold;font-style:normal">Speaker Identity</span></td>
                <td class="tg-yj5y"><span style="color:black">Language Identification</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2402.07729" target="_blank" rel="noopener noreferrer">Covost2-lan</a></td>
                <td class="tg-yj5y">1000</td>
                <td class="tg-jz12" rowspan="6"><span style="font-weight:bold">Speech Content</span></td>
                <td class="tg-yj5y"><span style="color:black">Speech Grounding</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2402.07729" target="_blank" rel="noopener noreferrer">Librispeech-grounding</a></td>
                <td class="tg-yj5y">1000</td>
            </tr>
            <tr>
                <td class="tg-yj5y"><span style="color:black">Sarcasm Detection</span></td>
                <td class="tg-yj5y"><a href="https://aclanthology.org/P19-1455/" target="_blank" rel="noopener noreferrer">MUSTARD</a></td>
                <td class="tg-yj5y">690</td>
                <td class="tg-yj5y"><span style="color:black">Gender Classification</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/1912.06670" target="_blank" rel="noopener noreferrer">Commonvoice</a></td>
                <td class="tg-yj5y">1258</td>
                <td class="tg-yj5y"><span style="color:black">Speech Entity Recognition</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2402.07729" target="_blank" rel="noopener noreferrer">SLURP-ent</a></td>
                <td class="tg-yj5y">1000</td>
            </tr>
            <tr>
                <td class="tg-yj5y">  <span style="color:black">Pragmatic Intent Detection</span></td>
                <td class="tg-yj5y"><a href="https://aclanthology.org/2020.emnlp-main.588/" target="_blank" rel="noopener noreferrer">SLURP</a></td>
                <td class="tg-yj5y">753</td>
                <td class="tg-yj5y"><span style="color:black">Age Classification</span>   </td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2408.12734" target="_blank" rel="noopener noreferrer">FairSpeech</a> </td>
                <td class="tg-yj5y">1000</td>
                <td class="tg-yj5y"><span style="color:black">Instruction Following</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2406.16020" target="_blank" rel="noopener noreferrer">Alpaca-Audio</a></td>
                <td class="tg-yj5y">100</td>
            </tr>
            <tr>
                <td class="tg-yj5y"><span style="color:black">Emotion Recognition</span></td>
                <td class="tg-yj5y"><a href="https://sail.usc.edu/iemocap/Busso_2008_iemocap.pdf" target="_blank" rel="noopener noreferrer">IEMOCAP</a></td>
                <td class="tg-yj5y">1023</td>
                <td class="tg-yj5y"><span style="color:black">Age Classification</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/1912.06670" target="_blank" rel="noopener noreferrer">Commonvoice</a></td>
                <td class="tg-yj5y">1258</td>
                <td class="tg-yj5y"><span style="color:black">Instruction Following</span></td>
                <td class="tg-yj5y"><a href="https://huggingface.co/datasets/teknium/OpenHermes-2.5" target="_blank" rel="noopener noreferrer">Openhermes-Audio</a></td>
                <td class="tg-yj5y">100</td>
            </tr>
            <tr>
                <td class="tg-yj5y"><span style="font-style:normal">Emotion Recognition</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/1810.02508" target="_blank" rel="noopener noreferrer">MELD</a></td>
                <td class="tg-yj5y">2608</td>
                <td class="tg-yj5y">Gender Classification</td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2408.12734" target="_blank" rel="noopener noreferrer">FairSpeech</a> </td>
                <td class="tg-yj5y">1000</td>
                <td class="tg-yj5y"><span style="color:black">Speech QA</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2406.16020" target="_blank" rel="noopener noreferrer">CN-College-Listen</a></td>
                <td class="tg-yj5y">2271</td>
            </tr>
            <tr>
                <td class="tg-yj5y"><span style="font-weight:bold">Speaker Identity</span></td>
                <td class="tg-yj5y"><span style="color:black">Relationship Classification</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/1912.06670" target="_blank" rel="noopener noreferrer">CallHome</a></td>
                <td class="tg-yj5y">24</td>
                <td class="tg-yj5y"><span style="color:black">Accent Classification</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/1912.06670" target="_blank" rel="noopener noreferrer">Commonvoice</a></td>
                <td class="tg-yj5y">1086</td>
                <td class="tg-yj5y"><span style="color:black">Speech QA</span></td>
                <td class="tg-yj5y"><a href="https://arxiv.org/abs/2406.16020" target="_blank" rel="noopener noreferrer">Public_sg_speech</a><span style="color:#156082">  </span></td>
                <td class="tg-yj5y">688</td>
            </tr>
            </tbody></table>
        </div></>
    )
}
