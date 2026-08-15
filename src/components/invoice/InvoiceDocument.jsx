import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import logo from '../../../assets/logo.jpeg';

const COLORS = {
  primary: '#1F7A3D',
  primaryDark: '#14532D',
  primaryTint: '#EAF4EC',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  surface: '#F4F6F5',
  white: '#FFFFFF',
  dark: '#111827',
};

// NOTE: The old default terms included a hardcoded "payment due within 7 days"
// clause. That has been removed per business requirements — there is no fixed
// payment deadline. Default terms now just state accepted payment methods.
// If invoice.terms is provided by the backend, that still takes priority (unchanged).
const DEFAULT_TERMS = [
  'Payment Methods: Bank Transfer / UPI / Cash.',
  'All prices are in INR and are subject to applicable taxes as stated on the invoice.',
  'Any additional work or materials outside the agreed scope will be charged separately with customer approval.',
  'Cancellation or rescheduling may be subject to applicable charges. Customers must provide access to the service location at the scheduled time.',
  'Any service warranty is applicable only as specified for the respective service and is subject to its applicable terms and conditions.'
];

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`;
}

function threeDigits(n) {
  if (n >= 100) {
    return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ' ' + twoDigits(n % 100) : ''}`;
  }
  return twoDigits(n);
}

function numberToWords(num) {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return 'Zero';
  let remaining = n;
  const parts = [];
  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;
  const hundred = remaining;

  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(' ');
}

// Local number formatter – no currency symbol, Indian comma style, two decimals
function formatNumber(num) {
  const n = Number(num) || 0;
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 0,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: COLORS.text,
  },
  body: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
    objectFit: 'contain',
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  brandTagline: {
    fontSize: 8,
    color: COLORS.muted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 4,
  },

  infoPanel: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  infoColLast: {
    borderRightWidth: 0,
  },
  infoColHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    textAlign: 'center',
  },
  infoColHeaderText: {
    color: COLORS.white,
    fontSize: 8.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoColBody: {
    padding: 10,
  },
  infoBold: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  infoLine: {
    fontSize: 8.5,
    color: COLORS.muted,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  infoLineBold: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 8.3,
    color: COLORS.muted,
  },
  detailValue: {
    fontSize: 8.3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },

  table: {
    marginBottom: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeadCell: {
    fontSize: 8.3,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowAlt: {
    backgroundColor: COLORS.surface,
  },
  tableCell: {
    fontSize: 9,
  },
  colNo: { flex: 0.5 },
  colDesc: { flex: 4 },
  colRate: { flex: 1.4, textAlign: 'right' },
  colQty: { flex: 0.8, textAlign: 'center' },
  colAmount: { flex: 1.5, textAlign: 'right' },

  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryTint,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },

  summarySection: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 20,
  },
  wordsBox: {
    flex: 1.4,
    justifyContent: 'center',
    paddingRight: 16,
  },
  wordsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  wordsValue: {
    fontSize: 9,
    color: COLORS.dark,
    lineHeight: 1.4,
  },
  taxBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  taxRowFinal: {
    backgroundColor: COLORS.primaryTint,
    borderBottomWidth: 0,
  },
  taxLabel: {
    fontSize: 8.5,
    color: COLORS.muted,
  },
  taxLabelFinal: {
    fontSize: 8.8,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  taxValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  taxValueFinal: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },

  // Payment status badge (only rendered if invoice.paymentStatus is supplied)
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusLabel: {
    fontSize: 8.5,
    color: COLORS.muted,
  },
  statusValuePaid: {
    fontSize: 8.8,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  statusValueUnpaid: {
    fontSize: 8.8,
    fontWeight: 'bold',
    color: '#B45309',
  },

  sectionBar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 1,
    textAlign:'center'
  },
  sectionBarText: {
    color: COLORS.white,
    fontSize: 8.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bankBlock: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginBottom: 16,
  },
  bankRow: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 8.7,
    color: COLORS.dark,
  },
  bankRowAlt: {
    backgroundColor: COLORS.surface,
  },
  bankLabel: {
    fontWeight: 'bold',
  },

  termsBlock: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginBottom: 18,
  },
  termsRow: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 8.3,
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  termsRowAlt: {
    backgroundColor: COLORS.surface,
  },

  notesTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notes: {
    fontSize: 8.7,
    color: COLORS.muted,
    lineHeight: 1.5,
    marginBottom: 16,
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: 7.5,
    fontStyle: 'italic',
    color: COLORS.muted,
    marginBottom: 4,
  },
  thankYou: {
    textAlign: 'center',
    fontSize: 9.5,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 14,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 8,
    color: COLORS.white,
    lineHeight: 1.6,
  },
});

export const InvoiceDocument = ({ invoice }) => {
  const generatedAt = invoice?.generatedAt ? format(new Date(invoice.generatedAt), 'dd MMM yyyy') : '';
  const dueAt = invoice?.dueDate ? format(new Date(invoice.dueDate), 'dd MMM yyyy') : '';
  const customer = invoice?.customerSnapshot || {};
  const appointment = invoice?.appointmentId;
  const rawAppointmentId = appointment?._id ? String(appointment._id) : appointment ? String(appointment) : '';
  const appointmentDisplayId = rawAppointmentId ? `#${rawAppointmentId.slice(-6).toUpperCase()}` : '';

  const rawItems = Array.isArray(invoice?.items) && invoice.items.length > 0 ? invoice.items : null;
  const items = rawItems
    ? rawItems.map((item) => {
        const quantity = Number(item.quantity) || 1;
        const unitPrice = Number(item.unitPrice) || 0;
        return {
          description: item.description,
          quantity,
          unitPrice,
          amount: Number(item.amount) || quantity * unitPrice,
        };
      })
    : [
        {
          description: invoice?.serviceSnapshot?.name || 'Service',
          quantity: 1,
          unitPrice: Number(invoice?.totalAmount) || 0,
          amount: Number(invoice?.totalAmount) || 0,
        },
      ];

  const subtotal = Number(invoice?.subtotal) || items.reduce((sum, item) => sum + item.amount, 0);
  const gstRate = Number(invoice?.gstRate) || 0;
  const gstAmount = Number(invoice?.gstAmount) || 0;
  const total = Number(invoice?.totalAmount) || subtotal + gstAmount;
  const amountInWords = invoice?.amountInWords || `INR ${numberToWords(total)} Rupees Only`;
  const terms = Array.isArray(invoice?.terms) && invoice.terms.length > 0 ? invoice.terms : DEFAULT_TERMS;
  const bank = invoice?.bankDetails;

  // Optional customer GSTIN. Expected at invoice.customerSnapshot.gstin (or .gstNumber
  // as a fallback in case the backend field is named differently). Only ever rendered
  // when a truthy value exists — never "N/A", never a blank row, never required.
  const customerGstin = customer.gstin || customer.gstNumber || '';

  // Optional payment status. Expected at invoice.paymentStatus, e.g. 'PAID' | 'UNPAID'.
  // Only rendered when the backend actually supplies this field — no invented logic.
  const paymentStatus = invoice?.paymentStatus ? String(invoice.paymentStatus).toUpperCase() : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Image src={logo} style={styles.logo} />
              <View>
                <Text style={styles.brandName}>GreenShield Home Solutions</Text>
                <Text style={styles.brandTagline}>TRUSTED HOME SERVICES AT YOUR DOORSTEP</Text>
              </View>
            </View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
          </View>

          <View style={styles.infoPanel}>
            <View style={styles.infoCol}>
              <View style={styles.infoColHeader}>
                <Text style={styles.infoColHeaderText}>Bill From</Text>
              </View>
              <View style={styles.infoColBody}>
                <Text style={styles.infoBold}>GreenShield Home Solutions</Text>
                <Text style={styles.infoLine}>Kolkata, West Bengal, India</Text>
                <Text style={styles.infoLine}>+91 76858 06236</Text>
                <Text style={styles.infoLine}>greenshieldhomesolutio@gmail.com</Text>
                {/* Business GSTIN: only shown when the business has one configured.
                    Sourced from invoice.gstNumber (unchanged from before) — never hardcoded. */}
                {invoice?.gstNumber && (
                  <Text style={styles.infoLineBold}>GSTIN: {invoice.gstNumber}</Text>
                )}
              </View>
            </View>
            <View style={styles.infoCol}>
              <View style={styles.infoColHeader}>
                <Text style={styles.infoColHeaderText}>Bill To</Text>
              </View>
              <View style={styles.infoColBody}>
                <Text style={styles.infoBold}>{customer.name || '—'}</Text>
                {customer.location ? <Text style={styles.infoLine}>{customer.location}</Text> : null}
                {customer.phone ? <Text style={styles.infoLine}>{customer.phone}</Text> : null}
                {customer.email ? <Text style={styles.infoLine}>{customer.email}</Text> : null}
                {/* Customer GSTIN is OPTIONAL. Only rendered when present — no blank row,
                    no "N/A" placeholder, never required from the customer. */}
                {customerGstin ? (
                  <Text style={styles.infoLineBold}>GSTIN: {customerGstin}</Text>
                ) : null}
              </View>
            </View>
            <View style={[styles.infoCol, styles.infoColLast]}>
              <View style={styles.infoColHeader}>
                <Text style={styles.infoColHeaderText}>Invoice Details</Text>
              </View>
              <View style={styles.infoColBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Invoice No.</Text>
                  <Text style={styles.detailValue}>{invoice?.invoiceNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Invoice Date</Text>
                  <Text style={styles.detailValue}>{generatedAt}</Text>
                </View>
                {/* Due date is only shown if the invoice record actually has one —
                    no due date is invented or defaulted here. */}
                {dueAt && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <Text style={styles.detailValue}>{dueAt}</Text>
                  </View>
                )}
                {appointmentDisplayId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Appointment</Text>
                    <Text style={styles.detailValue}>{appointmentDisplayId}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.tableHeadCell, styles.colNo]}>#</Text>
              <Text style={[styles.tableHeadCell, styles.colDesc]}>Service Description</Text>
              <Text style={[styles.tableHeadCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeadCell, styles.colRate]}>Rate (Rs)</Text>
              <Text style={[styles.tableHeadCell, styles.colAmount]}>Amount (Rs)</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.colNo]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colRate]}>{formatNumber(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.colAmount]}>{formatNumber(item.amount)}</Text>
              </View>
            ))}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
              <Text style={styles.grandTotalValue}>{formatNumber(total)}</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <View style={styles.wordsBox}>
              <Text style={styles.wordsLabel}>Amount in Words</Text>
              <Text style={styles.wordsValue}>{amountInWords}</Text>
            </View>
            <View style={styles.taxBox}>
              <View style={styles.taxRow}>
                <Text style={styles.taxLabel}>Service Amount</Text>
                <Text style={styles.taxValue}>{formatNumber(subtotal)}</Text>
              </View>
              {/* GST is only shown when applicable — never a generic "Tax" line,
                  never shown/calculated when gstRate/gstAmount are absent or zero. */}
              {gstRate > 0 && (
                <View style={styles.taxRow}>
                  <Text style={styles.taxLabel}>GST ({gstRate}%)</Text>
                  <Text style={styles.taxValue}>{formatNumber(gstAmount)}</Text>
                </View>
              )}
              <View style={[styles.taxRow, styles.taxRowFinal]}>
                <Text style={styles.taxLabelFinal}>Final Total</Text>
                <Text style={styles.taxValueFinal}>{formatNumber(total)}</Text>
              </View>
              {/* Payment status only renders when the backend supplies invoice.paymentStatus.
                  No status is invented or defaulted when the field is absent. */}
              {/* {paymentStatus ? (
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Payment Status</Text>
                  <Text style={paymentStatus === 'PAID' ? styles.statusValuePaid : styles.statusValueUnpaid}>
                    {paymentStatus}
                  </Text>
                </View>
              ) : null} */}
            </View>
          </View>

          {/* {invoice?.notes && (
            <View>
              <Text style={styles.notesTitle}>Notes</Text>
              <Text style={styles.notes}>{invoice.notes}</Text>
            </View>
          )} */}

          {bank && (bank.bankName || bank.accountNumber || bank.ifsc) && (
            <View>
              <View style={styles.sectionBar}>
                <Text style={styles.sectionBarText}>Bank Details</Text>
              </View>
              <View style={styles.bankBlock}>
                {bank.bankName && (
                  <Text style={styles.bankRow}><Text style={styles.bankLabel}>Bank: </Text>{bank.bankName}</Text>
                )}
                {bank.accountNumber && (
                  <Text style={[styles.bankRow, styles.bankRowAlt]}><Text style={styles.bankLabel}>Account No.: </Text>{bank.accountNumber}</Text>
                )}
                {bank.ifsc && (
                  <Text style={styles.bankRow}><Text style={styles.bankLabel}>IFSC Code: </Text>{bank.ifsc}</Text>
                )}
                {bank.branch && (
                  <Text style={[styles.bankRow, styles.bankRowAlt]}><Text style={styles.bankLabel}>Branch: </Text>{bank.branch}</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.sectionBar}>
            <Text style={styles.sectionBarText}>Terms & Condition</Text>
          </View>
          <View style={styles.termsBlock}>
            {terms.map((line, i) => (
              <Text key={i} style={[styles.termsRow, i % 2 === 1 && styles.termsRowAlt]}>
                {i + 1}. {line}
              </Text>
            ))}
          </View>

          <Text style={styles.disclaimer}>*This is a computer generated invoice and does not require a physical signature.</Text>
          <Text style={styles.thankYou}>THANK YOU FOR YOUR BUSINESS</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            www.greenshieldhomesolutions.in{'  |  '}greenshieldhomesolutio@gmail.com{'  |  '}+91 76858 06236
          </Text>
        </View>
      </Page>
    </Document>
  );
};