import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import maskedBrandOption from '../JSON Files/MaskedBrandOption.json'
const { REACT_APP_UPLOAD_DATA } = process.env;
export const uploadPDF = async (input,filename,selectedBrand, reportType, setLoading, setDownloadUrl) => {
    try {
        setLoading(true); // disable button & show loader

        const canvas = await html2canvas(input, { scale: 3, useCORS: true, scrollY: -window.scrollY });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // Convert to Blob for upload
        const pdfBlob = pdf.output("blob");

        // const now = new Date();
        // const formattedDateTime = `${String(now.getDate()).padStart(2, "0")}-${String(
        //     now.getMonth() + 1
        // ).padStart(2, "0")}-${now.getFullYear()}_${String(now.getHours()).padStart(
        //     2,
        //     "0"
        // )}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;

        const pdfName = `${filename}.pdf`;

        // Upload to backend
        const formData = new FormData();
        formData.append("file", pdfBlob, pdfName);
        formData.append("report_type", reportType);
        formData.append("brand", maskedBrandOption.maskedBrandOption[selectedBrand]);
        formData.append("blob_name", pdfName);

        const response = await fetch(`${REACT_APP_UPLOAD_DATA}/app/uploadReport`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            setDownloadUrl(data.pdf_name); // show “Download PDF” button
        } else {
            alert("Failed to upload report");
        }
    } catch (error) {
        console.error("Error generating/uploading PDF:", error);
    } finally {
        setLoading(false);
    }
};

export const downloadPdf = async (job_id, close) => {
    try {
        const url = `${REACT_APP_UPLOAD_DATA}/app/downloadReport?job_id=${encodeURIComponent(job_id)}`;

        // Create a temporary <a> tag to trigger browser download directly
        const a = document.createElement("a");
        a.href = url;
        a.download = job_id.split("/").pop(); // only filename
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Optionally, you can add a small delay to ensure loader is visible
        await new Promise((res) => setTimeout(res, 500));

    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download PDF");
    } finally {
        close();
    }
};
