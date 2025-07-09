import { useState } from "react"
import { FileText } from "lucide-react"
import {InvoicePreview} from "@/components/invoice-preview"
import { defaultInvoiceSettings } from "@/types/invoice"

export default function FindInvoices() {
    const [invoiceTo, setInvoiceTo] = useState("")
    const [dated, setDated] = useState("")
    const [invoiceNo, setInvoiceNo] = useState("")
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

    const handleSearch = async () => {
        setLoading(true)
        setSearched(true)
        const params = new URLSearchParams()
        if (invoiceTo) params.append("invoiceTo", invoiceTo)
        if (dated) params.append("dated", dated)
        if (invoiceNo) params.append("invoiceNo", invoiceNo)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/invoices?${params.toString()}`)
        const data = await res.json()
        setInvoices(data)
        setLoading(false)
    }

    const handleView = (inv: any) => {
        setSelectedInvoice(inv)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedInvoice(null)
    }

    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Invoices</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Invoice To"
                    value={invoiceTo}
                    onChange={e => setInvoiceTo(e.target.value)}
                />
                <input
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="date"
                    value={dated}
                    onChange={e => setDated(e.target.value)}
                />
                <input
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Invoice No"
                    value={invoiceNo}
                    onChange={e => setInvoiceNo(e.target.value)}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            <ul className="space-y-4">
                {searched && invoices.length === 0 && (
                    <li className="text-gray-500 text-center py-8 bg-white rounded shadow border">
                        No invoices found.
                    </li>
                )}
                {invoices.map((inv: any) => (
                    <li key={inv.invoiceNo} className="flex items-center justify-between bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    Invoice No:
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm">
                                        {inv.invoiceNo}
                                    </span>
                                </div>
                                <div className="text-gray-600 text-sm mt-1">
                                    <span className="font-medium">To:</span> {inv.invoiceTo}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">Date: {inv.dated}</div>
                            </div>
                        </div>
                        <button
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => handleView(inv)}
                        >
                            View
                        </button>
                    </li>
                ))}
            </ul>
            {/* Modal for Invoice Preview */}
            {showModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <InvoicePreview invoiceData={selectedInvoice} settings={defaultInvoiceSettings} />
                    </div>
                </div>
            )}
        </div>
    )
}