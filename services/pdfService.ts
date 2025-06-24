import jsPDF from 'jspdf';
import { ResumeAnalysis, JobSuggestionDetails } from '../types';

// IMPORTANT: Noto Sans JP Font Data (Base64 Encoded TTF)
// The following constant is a placeholder. You need to replace it with the
// actual base64 encoded string of NotoSansJP-Regular.ttf for Japanese text to render correctly.
// You can obtain NotoSansJP-Regular.ttf from Google Fonts, then convert it to base64.
// For example, using an online converter or a command-line tool.
const NOTO_SANS_JP_REGULAR_BASE64: string = `PLACEHOLDER_FOR_BASE64_ENCODED_NOTO_SANS_JP_REGULAR_TTF_DATA`;
// This placeholder will likely be thousands of lines long.
// If the placeholder is not replaced, Japanese characters will not render in the PDF.

const FONT_NAME = 'NotoSansJP';

interface PdfLine {
  text: string;
  isListItem?: boolean;
}

export const generateAnalysisPdf = (analysis: ResumeAnalysis, fileName?: string): void => {
  const doc = new jsPDF();

  // Register the font (only if actual font data is provided)
  if (NOTO_SANS_JP_REGULAR_BASE64 !== 'PLACEHOLDER_FOR_BASE64_ENCODED_NOTO_SANS_JP_REGULAR_TTF_DATA' && NOTO_SANS_JP_REGULAR_BASE64.length > 100) { // Basic check for placeholder
    try {
      doc.addFileToVFS('NotoSansJP-Regular.ttf', NOTO_SANS_JP_REGULAR_BASE64);
      doc.addFont('NotoSansJP-Regular.ttf', FONT_NAME, 'normal');
      doc.setFont(FONT_NAME);
    } catch (e) {
      console.error("Failed to load custom font for PDF. Japanese characters may not render correctly.", e);
      // Fallback to a standard font if custom font loading fails
      doc.setFont("helvetica"); // Or another standard font
    }
  } else {
    console.warn("Noto Sans JP font data is not provided. Japanese characters may not render correctly in the PDF.");
    doc.setFont("helvetica"); // Fallback font
  }

  doc.setProperties({
    title: '職務経歴書分析レポート - 株式会社morich',
    subject: `候補者 ${analysis.summary.substring(0,30)}... の分析結果`,
    author: '株式会社morich - morich profile scan',
    creator: '株式会社morich - morich profile scan'
  });

  let yPos = 15;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - 2 * margin;
  const lineSpacing = 6;
  const sectionSpacing = 10;
  const titleFontSize = 14;
  const regularFontSize = 10;
  const bullet = '\u2022 '; // Bullet point character

  const checkAndAddPage = () => {
    if (yPos > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPos = margin;
      if (doc.getFont().fontName === FONT_NAME) { // re-apply font if it was custom
         doc.setFont(FONT_NAME);
      }
    }
  };

  const addSectionTitle = (title: string) => {
    checkAndAddPage();
    doc.setFontSize(titleFontSize);
    doc.setTextColor(220, 53, 69); // Red-700 like color
    // Using an array for text allows for better rendering with custom fonts in some jsPDF versions
    doc.text([title], margin, yPos);
    doc.setFontSize(regularFontSize);
    doc.setTextColor(55, 65, 81); // Neutral-700 like color
    yPos += lineSpacing * 1.5;
  };

  const addParagraph = (text: string) => {
    checkAndAddPage();
    const splitText = doc.splitTextToSize(text, usableWidth);
    for (const line of splitText) {
      checkAndAddPage();
      doc.text([line], margin, yPos);
      yPos += lineSpacing;
    }
  };

  const addList = (items: string[]) => {
    if (!items || items.length === 0) {
      addParagraph("情報なし");
      return;
    }
    items.forEach(item => {
      checkAndAddPage();
      const textWithBullet = bullet + item;
      const splitText = doc.splitTextToSize(textWithBullet, usableWidth - 5); // Indent bullet
      for (const line of splitText) {
        checkAndAddPage();
        if (line.startsWith(bullet)) {
          doc.text([line], margin, yPos);
        } else {
          // For wrapped lines of a list item, indent them further
          doc.text([line], margin + 5, yPos); 
        }
        yPos += lineSpacing;
      }
    });
  };
  
  // PDF Header
  doc.setFontSize(18);
  doc.setTextColor(200, 40, 50);
  doc.text(["職務経歴書分析レポート"], pageWidth / 2, yPos, { align: 'center' });
  yPos += lineSpacing * 2;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text([`生成日: ${new Date().toLocaleDateString('ja-JP')}`], pageWidth / 2, yPos, { align: 'center' });
  yPos += sectionSpacing * 2;
  doc.setFontSize(regularFontSize);
  doc.setTextColor(55, 65, 81);


  // --- Content Sections ---

  addSectionTitle("職務要約");
  addParagraph(analysis.summary || "情報なし");
  yPos += sectionSpacing;

  addSectionTitle("保有スキル");
  addList(analysis.skills);
  yPos += sectionSpacing;

  addSectionTitle("職務経歴概要");
  addParagraph(analysis.experience_summary || "情報なし");
  yPos += sectionSpacing;

  addSectionTitle("主な強み");
  addParagraph(analysis.strength || "情報なし");
  yPos += sectionSpacing;

  addSectionTitle("潜在的な懸念点と面談での確認ポイント");
  addParagraph(analysis.potential_concerns || "情報なし");
  yPos += sectionSpacing;

  addSectionTitle("キャリア面談質問例");
  addList(analysis.interview_question_examples);
  yPos += sectionSpacing;

  addSectionTitle("マッチするであろうJOB提案");
  if (analysis.job_suggestions) {
    doc.setFontSize(regularFontSize); // Ensure regular font size for sub-headers
    doc.setTextColor(55, 65, 81); // Neutral-700 like color
    
    // Matched Positions
    const positionsTitle = "提案職種:";
    const splitPositionsTitle = doc.splitTextToSize(positionsTitle, usableWidth);
    doc.text(splitPositionsTitle, margin, yPos);
    yPos += lineSpacing * splitPositionsTitle.length;
    addList(analysis.job_suggestions.positions);
    yPos += lineSpacing;

    // Company Scale Details
    const scaleTitle = "企業規模・フェーズなど:";
    const splitScaleTitle = doc.splitTextToSize(scaleTitle, usableWidth);
    doc.text(splitScaleTitle, margin, yPos);
    yPos += lineSpacing * splitScaleTitle.length;
    addList(analysis.job_suggestions.company_scale_details);
    yPos += lineSpacing;

    // Supplementary Text
    const supplementaryTitle = "補足情報:";
    const splitSupplementaryTitle = doc.splitTextToSize(supplementaryTitle, usableWidth);
    doc.text(splitSupplementaryTitle, margin, yPos);
    yPos += lineSpacing * splitSupplementaryTitle.length;
    addParagraph(analysis.job_suggestions.supplementary_text || "情報なし");

  } else {
    addParagraph("情報なし");
  }

  // --- End of Content ---

  const finalFileName = fileName || `morich_profile_scan_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(finalFileName);
};