"use client"
import { useState } from "react"
import type { InvoiceData, InvoiceItem } from "@/types/invoice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface InvoiceSettings {
  title: string
  copyType: string
  supplierGstin: string
  supplierState: string
  supplierCode: string
  accountName: string
  accountNumber: string
  bankName: string
  branchName: string
  ifscCode: string
}

interface InvoiceEditorProps {
  invoiceData: InvoiceData
  onUpdate: (data: InvoiceData) => void
  settings: InvoiceSettings
}

export function InvoiceEditor({ invoiceData, onUpdate, settings }: InvoiceEditorProps) {
  const updateField = (field: keyof InvoiceData, value: any) => {
    // If updating billingAddress and shippingSame is true, update shippingAddress too
    if (field === "billingAddress" && shippingSame) {
      onUpdate({ ...invoiceData, billingAddress: value, shippingAddress: value })
    } else {
      onUpdate({ ...invoiceData, [field]: value })
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate amounts
    const item = newItems[index]
    const taxableAmount = item.quantity * item.rate
    item.taxAmount = (taxableAmount * item.gstRate) / 100
    item.amount = taxableAmount + item.taxAmount

    onUpdate({ ...invoiceData, items: newItems })
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      hsnSac: "",
      gstRate: 18,
      quantity: 0,
      rate: 0,
      taxAmount: 0,
      amount: 0,
    }
    onUpdate({ ...invoiceData, items: [...invoiceData.items, newItem] })
  }

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index)
    onUpdate({ ...invoiceData, items: newItems })
  }

  // Add local state for the checkbox
  const [shippingSame, setShippingSame] = useState(
    invoiceData.shippingAddress === invoiceData.billingAddress || !invoiceData.shippingAddress
  )

  // Handle checkbox change
  const handleShippingSameChange = (checked: boolean) => {
    setShippingSame(checked)
    if (checked) {
      onUpdate({ ...invoiceData, shippingAddress: invoiceData.billingAddress })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Invoice Header
            <span className="text-sm font-normal text-muted-foreground">
              (Using default settings - can be overridden)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Invoice Title</Label>
            <Input
              id="title"
              value={invoiceData.title || settings.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder={settings.title}
            />
          </div>
          <div>
            <Label htmlFor="copyType">Copy Type</Label>
            <Input
              id="copyType"
              value={invoiceData.copyType || settings.copyType}
              onChange={(e) => updateField("copyType", e.target.value)}
              placeholder={settings.copyType}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="invoiceTo">Invoice To</Label>
            <Textarea
              id="invoiceTo"
              value={invoiceData.invoiceTo}
              onChange={(e) => updateField("invoiceTo", e.target.value)}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="billingAddress">Billing adress</Label>
            <Textarea
              id="billingAddress"
              value={invoiceData.billingAddress}
              onChange={(e) => updateField("billingAddress", e.target.value)}
              rows={3}
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              id="shippingSame"
              type="checkbox"
              checked={shippingSame}
              onChange={(e) => handleShippingSameChange(e.target.checked)}
            />
            <Label htmlFor="shippingSame">Shipping address same as billing address</Label>
          </div>
          {!shippingSame && (
            <div className="col-span-2">
              <Label htmlFor="shippingAddress">Shipping address</Label>
              <Textarea
                id="shippingAddress"
                value={invoiceData.shippingAddress || ""}
                onChange={(e) => updateField("shippingAddress", e.target.value)}
                rows={3}
              />
            </div>
          )}
          <div>
            <Label htmlFor="invoiceNo">Invoice No.</Label>
            <Input
              id="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={(e) => updateField("invoiceNo", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dated">Dated</Label>
            <Input
              id="dated"
              type="date"
              value={invoiceData.dated}
              onChange={(e) => updateField("dated", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* GSTIN/UIN Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            GSTIN/UIN Details
            <span className="text-sm font-normal text-muted-foreground">(Supplier details from settings)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Supplier Details</h4>
              <div>
                <Label htmlFor="supplierGstin">GSTIN/UIN</Label>
                <Input
                  id="supplierGstin"
                  value={invoiceData.supplierGstin || settings.supplierGstin}
                  onChange={(e) => updateField("supplierGstin", e.target.value)}
                  placeholder={settings.supplierGstin}
                />
              </div>
              {/* PAN data removed */}
              {/* <div>
                <Label htmlFor="supplierPan">Pan No.</Label>
                <Input
                  id="supplierPan"
                  value={invoiceData.supplierPan || settings.supplierPan}
                  onChange={(e) => updateField("supplierPan", e.target.value)}
                  placeholder={settings.supplierPan}
                />
              </div> */}
              <div>
                <Label htmlFor="supplierState">State</Label>
                <Input
                  id="supplierState"
                  value={invoiceData.supplierState || settings.supplierState}
                  onChange={(e) => updateField("supplierState", e.target.value)}
                  placeholder={settings.supplierState}
                />
              </div>
              <div>
                <Label htmlFor="supplierCode">Code</Label>
                <Input
                  id="supplierCode"
                  value={invoiceData.supplierCode || settings.supplierCode}
                  onChange={(e) => updateField("supplierCode", e.target.value)}
                  placeholder={settings.supplierCode}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Buyer Details</h4>
              <div>
                <Label htmlFor="buyerGstin">GSTIN/UIN</Label>
                <Input
                  id="buyerGstin"
                  value={invoiceData.buyerGstin}
                  onChange={(e) => updateField("buyerGstin", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buyerOrderNo">Buyer's Order No.</Label>
                <Input
                  id="buyerOrderNo"
                  value={invoiceData.buyerOrderNo}
                  onChange={(e) => updateField("buyerOrderNo", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buyerOrderDate">Dated</Label>
                <Input
                  id="buyerOrderDate"
                  type="date"
                  value={invoiceData.buyerOrderDate}
                  onChange={(e) => updateField("buyerOrderDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dispatch Details */}
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="modeOfPayments">Mode of Payments</Label>
            <Input
              id="modeOfPayments"
              value={invoiceData.modeOfPayments}
              onChange={(e) => updateField("modeOfPayments", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="referenceNo">Reference No.</Label>
            <Input
              id="referenceNo"
              value={invoiceData.referenceNo}
              onChange={(e) => updateField("referenceNo", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="refDate">Ref Date</Label>
            <Input
              id="refDate"
              type="date"
              value={invoiceData.refDate}
              onChange={(e) => updateField("refDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dispatchDocNo">Delivery Challen Doc No.</Label>
            <Input
              id="dispatchDocNo"
              value={invoiceData.dispatchDocNo}
              onChange={(e) => updateField("dispatchDocNo", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="deliveryChallenDate">Delivery Challen Date</Label>
            <Input
              id="deliveryChallenDate"
              type="date"
              value={invoiceData.deliveryChallenDate}
              onChange={(e) => updateField("deliveryChallenDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dispatchedThrough">Dispatched through</Label>
            <Input
              id="dispatchedThrough"
              value={invoiceData.dispatchedThrough}
              onChange={(e) => updateField("dispatchedThrough", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={invoiceData.destination}
              onChange={(e) => updateField("destination", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="termsOfDelivery">Terms of Delivery</Label>
            <Input
              id="termsOfDelivery"
              value={invoiceData.termsOfDelivery}
              onChange={(e) => updateField("termsOfDelivery", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoiceData.items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Item {index + 1}</h4>
                  {invoiceData.items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Label>Description of Goods</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>HSN/SAC</Label>
                    <Input value={item.hsnSac} onChange={(e) => updateItem(index, "hsnSac", e.target.value)} />
                  </div>
                  <div>
                    <Label>GST Rate (%)</Label>
                    <Input
                      type="number"
                      value={item.gstRate}
                      onChange={(e) => updateItem(index, "gstRate", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Quantity (KG)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Rate (Rs./Kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Tax Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.taxAmount.toFixed(2)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" step="0.01" value={item.amount.toFixed(2)} readOnly className="bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Rates</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cgstRate">CGST Rate (%)</Label>
            <Input
              id="cgstRate"
              type="number"
              step="0.01"
              value={invoiceData.cgstRate}
              onChange={(e) => updateField("cgstRate", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="sgstRate">SGST Rate (%)</Label>
            <Input
              id="sgstRate"
              type="number"
              step="0.01"
              value={invoiceData.sgstRate}
              onChange={(e) => updateField("sgstRate", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Bank Details
            <span className="text-sm font-normal text-muted-foreground">
              (Using default settings - can be overridden)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accountName">Name of Account</Label>
            <Input
              id="accountName"
              value={invoiceData.accountName || settings.accountName}
              onChange={(e) => updateField("accountName", e.target.value)}
              placeholder={settings.accountName}
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Current Account Number</Label>
            <Input
              id="accountNumber"
              value={invoiceData.accountNumber || settings.accountNumber}
              onChange={(e) => updateField("accountNumber", e.target.value)}
              placeholder={settings.accountNumber}
            />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={invoiceData.bankName || settings.bankName}
              onChange={(e) => updateField("bankName", e.target.value)}
              placeholder={settings.bankName}
            />
          </div>
          <div>
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              value={invoiceData.branchName || settings.branchName}
              onChange={(e) => updateField("branchName", e.target.value)}
              placeholder={settings.branchName}
            />
          </div>
          <div>
            <Label htmlFor="ifscCode">IFS Code</Label>
            <Input
              id="ifscCode"
              value={invoiceData.ifscCode || settings.ifscCode}
              onChange={(e) => updateField("ifscCode", e.target.value)}
              placeholder={settings.ifscCode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card>
        <CardHeader>
          <CardTitle>Declaration & Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="declaration">Declaration</Label>
            <Textarea
              id="declaration"
              value={invoiceData.declaration}
              onChange={(e) => updateField("declaration", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="authorizedSignatory">Authorized Signatory</Label>
            <Input
              id="authorizedSignatory"
              value={invoiceData.authorizedSignatory}
              onChange={(e) => updateField("authorizedSignatory", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
