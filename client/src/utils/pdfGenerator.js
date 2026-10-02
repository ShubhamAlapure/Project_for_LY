import html2pdf from 'html2pdf.js';

/**
 * Generates and downloads an exact single-page A4 PDF from a DOM element
 * @param {HTMLElement} element - The DOM element of the A4 document paper
 * @param {string} filename - Target PDF file name
 * @param {object} options - Optional overrides
 * @returns {Promise<boolean>}
 */
export const downloadDocumentPDF = async (element, filename = 'document.pdf', options = {}) => {
  if (!element) {
    throw new Error("Target document element not found for PDF export.");
  }

  const opt = {
    margin: 0,
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth || 794
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: 'avoid-all' },
    ...options
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error("PDF Generation error:", error);
    throw error;
  }
};
