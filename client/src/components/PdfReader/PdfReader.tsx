import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

type PdfReaderProps = {
  pdf: File
}

function PdfReader(props: PdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function inner() {
      const loadingTask = pdfjsLib.getDocument(new Float64Array(await props.pdf.arrayBuffer()));
      (async () => {
        const pdf = await loadingTask.promise;
        //
        // Fetch the first page
        //
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        // Support HiDPI-screens.
        const outputScale = window.devicePixelRatio || 1;

        //
        // Prepare canvas using PDF page dimensions
        //
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext("2d");
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = Math.floor(viewport.width) + "px";
          canvas.style.height = Math.floor(viewport.height) + "px";

          const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

          //
          // Render PDF page into canvas context
          //
          const renderContext = {
            canvasContext: context,
            transform,
            viewport,
          };
          //@ts-ignore
          page.render(renderContext);
        }
      })();
    }
    inner()
  })


  return <div>
    <canvas ref={canvasRef}></canvas>
  </div>;
}

export default PdfReader;
