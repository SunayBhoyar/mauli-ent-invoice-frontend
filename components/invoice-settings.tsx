"use client"

import type React from "react"

import type { InvoiceSettings } from "@/types/invoice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useState, useRef } from "react"

interface InvoiceSettingsProps {
  settings: InvoiceSettings
  onUpdate: (settings: InvoiceSettings) => void
}

export function InvoiceSettings({ settings, onUpdate }: InvoiceSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string>(settings.companyLogo || "")

  const updateField = (field: keyof InvoiceSettings, value: any) => {
    onUpdate({ ...settings, [field]: value })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        updateField("companyLogo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview("")
    updateField("companyLogo", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Invoice Settings</h2>
        <p className="text-muted-foreground">Configure default values that will be pre-filled in your invoices</p>
      </div>

      {/* Header Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Header Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-title">Invoice Title</Label>
              <Input
                id="settings-title"
                value={settings.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="settings-copyType">Copy Type</Label>
              <Input
                id="settings-copyType"
                value={settings.copyType}
                onChange={(e) => updateField("copyType", e.target.value)}
              />
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <Label>Company Logo</Label>
            <div className="mt-2">
              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-20 w-auto border border-gray-300 rounded"
                  />
                  <Button
                    onClick={removeLogo}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-2">
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Details (Your Company)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="settings-supplierName">Company Name</Label>
            <Input
              id="settings-supplierName"
              value={settings.supplierName}
              onChange={(e) => updateField("supplierName", e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          <div>
            <Label htmlFor="settings-supplierAddress">Company Address</Label>
            <Textarea
              id="settings-supplierAddress"
              value={settings.supplierAddress}
              onChange={(e) => updateField("supplierAddress", e.target.value)}
              placeholder="Complete address with city, state, pincode"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-supplierGstin">GSTIN/UIN</Label>
              <Input
                id="settings-supplierGstin"
                value={settings.supplierGstin}
                onChange={(e) => updateField("supplierGstin", e.target.value)}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>

            {/* PAN Details removed */}
            {/* <div>
              <Label htmlFor="settings-supplierPan">PAN No.</Label>
              <Input
                id="settings-supplierPan"
                value={settings.supplierPan}
                onChange={(e) => updateField("supplierPan", e.target.value)}
                placeholder="AAAAA0000A"
              />
            </div> */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-supplierState">State</Label>
              <Input
                id="settings-supplierState"
                value={settings.supplierState}
                onChange={(e) => updateField("supplierState", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="settings-supplierCode">State Code</Label>
              <Input
                id="settings-supplierCode"
                value={settings.supplierCode}
                onChange={(e) => updateField("supplierCode", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-accountName">Account Name</Label>
              <Input
                id="settings-accountName"
                value={settings.accountName}
                onChange={(e) => updateField("accountName", e.target.value)}
                placeholder="Account holder name"
              />
            </div>
            <div>
              <Label htmlFor="settings-accountNumber">Account Number</Label>
              <Input
                id="settings-accountNumber"
                value={settings.accountNumber}
                onChange={(e) => updateField("accountNumber", e.target.value)}
                placeholder="1234567890"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-bankName">Bank Name</Label>
              <Input
                id="settings-bankName"
                value={settings.bankName}
                onChange={(e) => updateField("bankName", e.target.value)}
                placeholder="State Bank of India"
              />
            </div>
            <div>
              <Label htmlFor="settings-branchName">Branch Name</Label>
              <Input
                id="settings-branchName"
                value={settings.branchName}
                onChange={(e) => updateField("branchName", e.target.value)}
                placeholder="Main Branch"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="settings-ifscCode">IFSC Code</Label>
            <Input
              id="settings-ifscCode"
              value={settings.ifscCode}
              onChange={(e) => updateField("ifscCode", e.target.value)}
              placeholder="SBIN0000123"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          These settings will be automatically applied to new invoices. You can still edit them individually if needed.
        </p>
      </div>
    </div>
  )
}
