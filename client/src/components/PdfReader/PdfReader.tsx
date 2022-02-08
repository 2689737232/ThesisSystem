import React, { useEffect, useRef } from 'react';
import "./PdfReader.less"
import * as pdfjsLib from 'pdfjs-dist';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setTargetPDF } from '@/features/importPdfSlice';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;


type PdfReaderProps = {
  pdf: File
}

function PdfReader(props: PdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispatch = useAppDispatch()
  useEffect(() => {
    async function inner() {
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(await props.pdf.arrayBuffer()));
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
          if (context && transform && transform.length > 0) {
            const renderContext = {
              canvasContext: context,
              transform,
              viewport,
            };
            page.render(renderContext);
          }
        }
      })();
    }
    inner()
  })

  function handleClick() {
    dispatch(setTargetPDF(null))
  }

  return <div onClick={handleClick } className='pdf-reader-container'>
    <canvas ref={canvasRef}></canvas>
  </div>;
}

export default PdfReader;
