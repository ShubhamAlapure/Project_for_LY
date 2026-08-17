import html2pdf from 'html2pdf.js';

/**
 * Generates and downloads an exact A4 PDF from a DOM element
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
    margin: [10, 10, 10, 10], // mm
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
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
