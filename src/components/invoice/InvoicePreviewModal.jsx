import { useState } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { InvoiceDocument } from './InvoiceDocument';

export const InvoicePreviewModal = ({ isOpen, onClose, invoice }) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={invoice ? `${t('admin.invoicePreview')} — ${invoice.invoiceNumber}` : t('admin.invoicePreview')}
      size="xl"
      contentClassName="p-2 sm:p-3"
    >
      <div className="flex flex-col gap-4">
        <div className="h-[70vh] overflow-hidden rounded-2xl border border-border bg-surface-2">
          {invoice && (
            <PDFViewer className="h-full w-full" showToolbar>
              <InvoiceDocument invoice={invoice} />
            </PDFViewer>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button onClick={handleDownload} loading={downloading} leftIcon={!downloading ? <Download className="h-4 w-4" /> : undefined}>
            {t('admin.downloadInvoice')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
