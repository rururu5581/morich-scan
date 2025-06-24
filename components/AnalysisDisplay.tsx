import jsPDF from 'jspdf';
// ...他のimport

// PDF出力ボタンのクリックハンドラ（例）
const handlePdfExport = async () => {
  const doc = new jsPDF();

  // 1. フォントファイルを読み込む
  const fontUrl = '/fonts/NotoSansJP-Regular.ttf'; // public/fonts/からのパス
  const response = await fetch(fontUrl);
  const fontBlob = await response.blob();
  const fontData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(fontBlob);
  });
  
  // Data URLから 'data:...;base64,' の部分を取り除く
  const fontBase64 = fontData.substring(fontData.indexOf(',') + 1);

  // 2. jsPDFにフォントを追加する
  const fontName = 'NotoSansJP';
  doc.addFileToVFS('NotoSansJP-Regular.ttf', fontBase64);
  doc.addFont('NotoSansJP-Regular.ttf', fontName, 'normal');
  
  // 3. 追加したフォントを設定する
  doc.setFont(fontName);

  // 4. 日本語テキストを描画する
  // これで文字化けしなくなります！
  doc.text("職務要約", 10, 20); 
  doc.text(analysisResult.summary, 10, 30); // analysisResultはStateから取得
  
  // ...他の項目も同様に描画...
  
  // 5. PDFを保存
  doc.save("analysis_result.pdf");
};