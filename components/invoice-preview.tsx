"use client"
import { useState, useEffect, useRef } from "react"
import type { InvoiceData } from "@/types/invoice"
import type { InvoiceSettings } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { FileText, Edit3, Download, Printer, Settings } from "lucide-react"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
  settings: InvoiceSettings
  onReset?: () => void
}

export function InvoicePreview({ invoiceData, settings, onReset }: InvoicePreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<null | "confirm" | "success" | "error">(null)
  const [modalMessage, setModalMessage] = useState("")

  const handlePrint = async () => { };

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const html2pdf = (await import("html2pdf.js")).default

      html2pdf()
        .from(invoiceRef.current)
        .set({
          margin: 0.25,
          filename: "invoice.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        })
        .save()
    }
  }

  const handleFinalise = async () => {
    setModal("confirm")
    setModalMessage("Are you sure you want to finalise and save this invoice?")
  }

  const confirmFinalise = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/invoices/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      })
      if (response.ok) {
        setModal("success")
        setModalMessage("Invoice finalised and saved!")
        if (onReset) {
          onReset();
          window.location.reload();
        }
          
      } else {
        setModal("error")
        setModalMessage("Failed to save invoice.")
      }
    } catch (error) {
      setModal("error")
      setModalMessage("Error connecting to backend.")
    }
  }


  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    const cgstAmount = (subtotal * invoiceData.cgstRate) / 100
    const sgstAmount = (subtotal * invoiceData.sgstRate) / 100
    const totalAmount = subtotal + cgstAmount + sgstAmount

    return { subtotal, cgstAmount, sgstAmount, totalAmount }
  }

  const { subtotal, cgstAmount, sgstAmount, totalAmount } = calculateTotals()

  const numberToWords = (num: number): string => {
    if (num === 0) return "Rupees Zero Only";

    const oneToNineteen = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
      "Eighty", "Ninety"
    ];

    const numToWords = (n: number): string => {
      let word = "";

      if (n >= 10000000) {
        word += numToWords(Math.floor(n / 10000000)) + " Crore ";
        n %= 10000000;
      }
      if (n >= 100000) {
        word += numToWords(Math.floor(n / 100000)) + " Lakh ";
        n %= 100000;
      }
      if (n >= 1000) {
        word += numToWords(Math.floor(n / 1000)) + " Thousand ";
        n %= 1000;
      }
      if (n >= 100) {
        word += numToWords(Math.floor(n / 100)) + " Hundred ";
        n %= 100;
      }
      if (n > 0) {
        if (n < 20) {
          word += oneToNineteen[n] + " ";
        } else {
          word += tens[Math.floor(n / 10)] + " " + oneToNineteen[n % 10] + " ";
        }
      }

      return word.trim();
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = "Rupees " + numToWords(rupees);

    if (paise > 0) {
      result += " and " + numToWords(paise) + " Paise";
    }

    return result + " Only";
  };

  // Modal JSX
  const showModal = modal !== null
  const isConfirm = modal === "confirm"
  const isSuccess = modal === "success"
  const isError = modal === "error"

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-full">
      <div className="flex gap-2 p-2">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={handleFinalise} className="flex items-center gap-2" variant="secondary">
          <FileText className="h-4 w-4" />
          Finalise
        </Button>
      </div>
      <div className="p-8 border border-gray-300 print:border-none">
        {/* Header */}
        <div ref={invoiceRef}>
          <div className="font-bold text-lg text-blue-700 mb-2">{invoiceData.title || settings.title}</div>
          <div className="border border-slate-400 mb-0">
            <div className="border-b border-slate-400 p-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {settings.companyLogo && (
                    <img src={settings.companyLogo || "/placeholder.svg"} alt="Company Logo" className="h-12 w-auto" />
                  )}
                  <div>

                    {settings.supplierName && <div className="text-md font-bold">{settings.supplierName}</div>}
                    {settings.supplierAddress && (
                      <div className="text-xs text-gray-600 whitespace-pre-wrap">{settings.supplierAddress}</div>
                    )}
                    <div className="text-xs">Firm GST No : {settings.supplierGstin} , Contact No : {settings.supplierContact} </div>
                  </div>
                </div>
                <div className="text-sm">{invoiceData.copyType || settings.copyType}</div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex">
              <div className="w-1/2 border-r border-slate-400  p-1.5">
                Invoice To :-
                <div className="min-h-[20px] whitespace-pre-wrap">{invoiceData.invoiceTo}</div>
                <div className="min-h-[60px] text-sm whitespace-pre-wrap">Billing address :- {invoiceData.billingAddress}</div>
              </div>
              <div className="w-1/2">
                <div className="flex ">
                  <div className="w-1/2 p-1.5 border-r border-slate-400 text-sm font-medium">Invoice No. : {invoiceData.invoiceNo}</div>
                  <div className="w-1/2 p-1.5 text-sm font-medium">Dated : {invoiceData.dated}</div>
                </div>
                <div className="flex border-t border-slate-400">
                  <div className="w-1/2  p-1.5 border-r border-slate-400 text-sm font-medium">Buyer's Order No. : {invoiceData.buyerOrderNo}</div>
                  <div className="w-1/2 p-1.5 text-sm font-medium">Dated : {invoiceData.buyerOrderDate}</div>
                </div>
                <div className="p-1.5 text-sm border-y border-slate-400 font-medium">Mode of Payments : {invoiceData.modeOfPayments}</div>
                <div className="flex border-b border-slate-400">
                  <div className="w-1/2  p-1.5 border-r border-slate-400 text-sm font-medium">Reference No. : {invoiceData.referenceNo} </div>
                  <div className="w-1/2 p-1.5 text-sm font-medium">Ref Date. : {invoiceData.refDate} </div>
                </div>
              </div>
            </div>

            {/* GSTIN Section */}
            <div className="flex ">
              <div className="w-1/2 border-r border-slate-400">
                <div className="flex border-y border-slate-400">
                  <div className="w-24  p-1.5  text-sm font-medium">GSTIN/UIN:</div>
                  <div className="flex-1 p-1.5 text-sm">
                    {invoiceData.buyerGstin}
                  </div>
                </div>
                <div className="text-sm p-1.5 ">
                  <span className="font-medium">Shipping address</span>
                  <div className="min-h-[60px] whitespace-pre-wrap">{invoiceData.shippingAddress}</div>
                </div>
              </div>
              <div className="w-1/2 ">

                <div className="flex">
                  <div className="w-1/2 border-r border-slate-400  p-1.5 text-sm font-medium">Delivery Challen Doc No.</div>
                  <div className="w-1/2 p-1.5 text-sm font-medium">Delivery Challen Date</div>
                </div>
                <div className="flex border-b border-slate-400">
                  <div className="w-1/2 border-r border-slate-400 p-1.5 text-sm">{invoiceData.dispatchDocNo}</div>
                  <div className="w-1/2 p-1.5 text-sm">{invoiceData.deliveryChallenDate}</div>
                </div>
                <div className="flex ">
                  <div className="w-1/2 border-r border-slate-400 p-1.5 text-sm font-medium">Dispatched through</div>
                  <div className="w-1/2 p-1.5 text-sm font-medium">Destination</div>
                </div>
                <div className="flex">
                  <div className="w-1/2 border-r border-slate-400 p-1.5 text-sm">{invoiceData.dispatchedThrough}</div>
                  <div className="w-1/2 p-1.5 text-sm">{invoiceData.destination}</div>
                </div>
              </div>
            </div>

            {/* Buyer GSTIN Section */}
            <div className="flex border-y border-slate-400">
              <div className="w-1/2 ">
                <div className="flex">
                  <div className="w-24  p-1.5 text-sm font-medium">State</div>
                  <div className="flex-1 p-1.5 text-sm"> {invoiceData.supplierState || settings.supplierState}</div>
                  <div className="w-20  p-1.5 text-sm font-medium">Code:</div>
                  <div className="w-28 p-1.5 text-sm">{invoiceData.supplierCode || settings.supplierCode}</div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="text-sm p-1.5 font-medium align-middle">Terms of Delivery: {invoiceData.termsOfDelivery}</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="">
              <div className="flex border-b border-slate-400 bg-gray-100">
                <div className="w-8  p-1.5 text-xs font-medium text-center">Sr. No.</div>
                <div className="flex-1  p-1.5 text-xs font-medium text-center">
                  Description of Goods
                </div>
                <div className="w-16  p-1.5 text-xs font-medium text-center">HSN/ SAC</div>
                <div className="w-16  p-1.5 text-xs font-medium text-center">GST Rate</div>
                <div className="w-20  p-1.5 text-xs font-medium text-center">Quantity (unit)</div>
                <div className="w-20  p-1.5 text-xs font-medium text-center">Rate (₹/unit)</div>
                <div className="w-20  p-1.5 text-xs font-medium text-center">Tax Amount</div>
                <div className="w-20 p-1.5 text-xs font-medium text-center">Amount</div>
              </div>

              {invoiceData.items.map((item, index) => (
                <div key={item.id} className="flex  min-h-[30px]">
                  <div className="w-8  p-1.5 text-xs text-center">{index + 1}</div>
                  <div className="flex-1  p-1.5 text-xs">{item.description}</div>
                  <div className="w-16  p-1.5 text-xs text-center">{item.hsnSac}</div>
                  <div className="w-16  p-1.5 text-xs text-center">{item.gstRate}%</div>
                  <div className="w-20  p-1.5 text-xs text-right">{item.quantity.toFixed(2)}</div>
                  <div className="w-20  p-1.5 text-xs text-right">₹{item.rate.toFixed(2)}</div>
                  <div className="w-20  p-1.5 text-xs text-right">₹{item.taxAmount.toFixed(2)}</div>
                  <div className="w-20 p-1.5 text-xs text-right">₹{item.amount.toFixed(2)}</div>
                </div>
              ))}

              {/* Empty rows for spacing */}
              {Array.from({ length: Math.max(0, 1 - invoiceData.items.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="flex  h-8">
                  <div className="w-8 border-rborder-black"></div>
                  <div className="flex-1 "></div>
                  <div className="w-16 "></div>
                  <div className="w-16 "></div>
                  <div className="w-20 "></div>
                  <div className="w-20 "></div>
                  <div className="w-20 "></div>
                  <div className="w-20"></div>
                </div>
              ))}

              {/* Total Row */}
              <div className="flex border-y border-slate-400 bg-gray-100">
                <div className="flex-1  p-1.5 text-sm font-medium text-right">Total Basic Amount:</div>
                <div className="w-20 p-1.5 text-sm font-medium text-right">₹{subtotal.toFixed(2)}</div>
              </div>

              {/* Tax Summary */}
              <div className="flex">
                <div className="w-2/3 border-r border-slate-400">
                  <div className="p-1.5 text-sm">
                    <strong>Amount Chargeable (in words):</strong>
                    <div className="mt-1">{numberToWords(totalAmount)}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex ">
                    <div className="flex-1  p-1 text-xs font-medium text-center">CGST</div>
                    <div className="w-12  p-1 text-xs text-center">{invoiceData.cgstRate}%</div>
                    <div className="w-20 p-1 text-xs text-right">₹{cgstAmount.toFixed(2)}</div>
                  </div>
                  <div className="flex ">
                    <div className="flex-1  p-1 text-xs font-medium text-center">SGST</div>
                    <div className="w-12  p-1 text-xs text-center">{invoiceData.sgstRate}%</div>
                    <div className="w-20 p-1 text-xs text-right">₹{sgstAmount.toFixed(2)}</div>
                  </div>
                  <div className="flex border-t border-slate-400">
                    <div className="flex-1  p-1 text-md font-medium text-center">Total Amount:</div>
                    <div className="w-30 p-1 text-md font-medium text-right">₹{totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Breakdown Table */}
            <div className="">
              <div className="flex border-y border-slate-400 bg-gray-100">
                <div className="w-20  p-1 text-xs font-medium text-center">HSN/ SAC</div>
                <div className="w-24  p-1 text-xs font-medium text-center">Taxable Value</div>
                <div className="flex-1 ">
                  <div className="text-xs font-medium text-center p-1">CGST</div>
                  <div className="flex">
                    <div className="w-1/2  p-1 text-xs font-medium text-center">Rate</div>
                    <div className="w-1/2 p-1 text-xs font-medium text-center">Amount</div>
                  </div>
                </div>
                <div className="flex-1 ">
                  <div className="text-xs font-medium text-center p-1">SGST</div>
                  <div className="flex">
                    <div className="w-1/2  p-1 text-xs font-medium text-center">Rate</div>
                    <div className="w-1/2 p-1 text-xs font-medium text-center">Amount</div>
                  </div>
                </div>
                <div className="w-24 p-1 text-xs font-medium text-center">Total Tax Amount</div>
              </div>

              {invoiceData.items.map((item) => (
                <div key={`tax-${item.id}`} className="flex ">
                  <div className="w-20  p-1 text-xs text-center">{item.hsnSac}</div>
                  <div className="w-24  p-1 text-xs text-right">
                    {(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <div className="flex-1 ">
                    <div className="flex">
                      <div className="w-1/2  p-1 text-xs text-center">{invoiceData.cgstRate}%</div>
                      <div className="w-1/2 p-1 text-xs text-right">
                        ₹{((item.quantity * item.rate * invoiceData.cgstRate) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 ">
                    <div className="flex">
                      <div className="w-1/2  p-1 text-xs text-center">{invoiceData.sgstRate}%</div>
                      <div className="w-1/2 p-1 text-xs text-right">
                        ₹{((item.quantity * item.rate * invoiceData.sgstRate) / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-24 p-1 text-xs text-right">₹{item.taxAmount.toFixed(2)}</div>
                </div>
              ))}

              <div className="flex border-y border-slate-400 bg-gray-100">
                <div className="w-20  p-1 text-xs font-medium">Total:</div>
                <div className="w-24  p-1 text-xs font-medium text-right">{subtotal.toFixed(2)}</div>
                <div className="flex-1 ">
                  <div className="flex">
                    <div className="w-1/2  p-1 text-xs"></div>
                    <div className="w-1/2 p-1 text-xs font-medium text-right">₹{cgstAmount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex-1 ">
                  <div className="flex">
                    <div className="w-1/2  p-1 text-xs"></div>
                    <div className="w-1/2 p-1 text-xs font-medium text-right">₹{sgstAmount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="w-24 p-1 text-xs font-medium text-right">₹{(cgstAmount + sgstAmount).toFixed(2)}</div>
              </div>
            </div>

            {/* Tax Amount in Words */}
            <div className="border-b border-slate-400 p-1.5">
              <div className="text-sm">
                <strong>Tax Amount (in words): </strong>
                {numberToWords(cgstAmount + sgstAmount)}
              </div>
            </div>

            {/* Bank Details */}
            <div className=" flex">
              <div className="flex-1  p-1.5">
                <div className="text-sm font-medium mb-2">Bank Details:</div>
                <div className="space-y-1 text-xs">
                  <div>
                    <strong>Name of Account:</strong> {invoiceData.accountName || settings.accountName}
                  </div>
                  <div>
                    <strong>Current Account Number:</strong> {invoiceData.accountNumber || settings.accountNumber}
                  </div>
                  <div>
                    <strong>Bank Name:</strong> {invoiceData.bankName || settings.bankName}
                  </div>
                  <div>
                    <strong>Branch Name:</strong> {invoiceData.branchName || settings.branchName}
                  </div>
                  <div>
                    <strong>IFS Code:</strong> {invoiceData.ifscCode || settings.ifscCode}
                  </div>
                </div>
              </div>
              <div className="w-48 border-l border-slate-400 p-1.5 text-right  items-center flex flex-col">
                <img src={settings.signature || "/placeholder.svg"} alt="Company Logo" className="h-20 w-auto" />
                <div className="text-sm font-medium">Authorised Signatory</div>
                <div className="mt-8 text-xs">{invoiceData.authorizedSignatory}</div>
              </div>
            </div>

            {/* Declaration */}
            <div className="border-t border-slate-400 p-1.5">
              <div className="text-xs">
                <strong>Declaration:</strong> {invoiceData.declaration}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="mb-4 text-lg">{modalMessage}</div>
            {isConfirm && (
              <div className="flex justify-center gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setModal(null)
                    confirmFinalise()
                  }}
                >
                  Yes, Finalise
                </button>
                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            )}
            {(isSuccess || isError) && (
              <button
                className={`mt-4 px-4 py-2 rounded ${isSuccess ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                onClick={() => setModal(null)}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
