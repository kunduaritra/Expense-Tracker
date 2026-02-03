import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import BottomSheet from "../components/common/BottomSheet";
import Input from "../components/common/Input";
import { formatCurrency } from "../utils/formatters";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
} from "lucide-react";

const ACCOUNT_TYPES = [
  { id: "savings", name: "Savings", emoji: "🏦" },
  { id: "current", name: "Current", emoji: "🏢" },
  { id: "salary", name: "Salary", emoji: "💼" },
  { id: "cash", name: "Cash Wallet", emoji: "💵" },
  { id: "wallet", name: "Digital Wallet", emoji: "📱" },
];

const ACCOUNT_COLORS = [
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#06B6D4",
];

const BankAccounts = () => {
  const { accounts, addAccount, updateAccount, removeAccount, transactions } =
    useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [visibleBalances, setVisibleBalances] = useState({});
  const [reportFilter, setReportFilter] = useState("all"); // all, income, expense

  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    type: "savings",
    balance: "",
    color: "#8B5CF6",
  });

  const [errors, setErrors] = useState({});

  // Toggle balance visibility
  const toggleBalanceVisibility = (id) => {
    setVisibleBalances((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get transactions for account
  const getAccountTransactions = (accountId) => {
    return transactions
      .filter((t) => t.accountId === accountId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!formData.accountHolder.trim())
      newErrors.accountHolder = "Account holder name is required";
    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Account number is required";
    if (formData.balance === "" || isNaN(formData.balance))
      newErrors.balance = "Enter a valid balance";
    return newErrors;
  };

  // Submit Add
  const handleAdd = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    addAccount({ ...formData, balance: parseFloat(formData.balance) });
    resetForm();
    setShowAddModal(false);
  };

  // Submit Edit
  const handleEdit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    updateAccount(selectedAccount.id, {
      ...formData,
      balance: parseFloat(formData.balance),
    });
    resetForm();
    setShowEditModal(false);
    setSelectedAccount(null);
  };

  // Open edit modal
  const openEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      bankName: account.bankName,
      accountHolder: account.accountHolder,
      accountNumber: account.accountNumber,
      ifsc: account.ifsc || "",
      branch: account.branch || "",
      type: account.type,
      balance: account.balance.toString(),
      color: account.color,
    });
    setErrors({});
    setShowEditModal(true);
  };

  // Open report
  const openReport = (account) => {
    setSelectedAccount(account);
    setReportFilter("all");
    setShowReportModal(true);
  };

  const resetForm = () => {
    setFormData({
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
      branch: "",
      type: "savings",
      balance: "",
      color: "#8B5CF6",
    });
    setErrors({});
  };

  const getTypeInfo = (typeId) =>
    ACCOUNT_TYPES.find((t) => t.id === typeId) || ACCOUNT_TYPES[0];

  // Totals
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  // Report filtered transactions
  const reportTransactions = selectedAccount
    ? getAccountTransactions(selectedAccount.id).filter(
        (t) => reportFilter === "all" || t.type === reportFilter,
      )
    : [];

  const reportIncome = selectedAccount
    ? getAccountTransactions(selectedAccount.id)
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0)
    : 0;
  const reportExpense = selectedAccount
    ? getAccountTransactions(selectedAccount.id)
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0)
    : 0;

  // Shared form JSX
  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-gray-400">Manage all your accounts</p>
        </div>

        <button
          onClick={() => {
            resetForm(); // clear old data
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shrink-0"
        >
          Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        }}
      >
        <p className="text-sm opacity-80 mb-1">
          Total Balance Across All Accounts
        </p>
        <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs opacity-80">
              {accounts.length} Account{accounts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      {accounts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-5xl">🏦</span>
            <h3 className="text-lg font-semibold mt-3 mb-2">
              No Accounts Added
            </h3>
            <p className="text-gray-400 mb-4">
              Add your bank accounts to track balances
            </p>
            <Button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              icon={Plus}
            >
              Add First Account
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => {
            const typeInfo = getTypeInfo(account.type);
            const isVisible = visibleBalances[account.id];
            const last4 = account.accountNumber.slice(-4);

            return (
              <div
                key={account.id}
                className="rounded-2xl p-5 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${account.color} 0%, ${account.color}BB 100%)`,
                }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

                <div className="relative z-10">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs opacity-70 uppercase tracking-wide">
                        {typeInfo.emoji} {typeInfo.name} Account
                      </p>
                      <h3 className="text-xl font-bold mt-1">
                        {account.bankName}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(account)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => removeAccount(account.id)}
                        className="p-2 bg-white/10 hover:bg-red-500/40 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <p className="text-sm opacity-70 mb-1">
                    {account.accountHolder}
                  </p>
                  <p className="font-mono tracking-widest text-lg mb-4">
                    •••• •••• •••• {last4}
                  </p>
                  {account.ifsc && (
                    <p className="text-xs opacity-60 mb-3">
                      IFSC: {account.ifsc}{" "}
                      {account.branch ? `• ${account.branch}` : ""}
                    </p>
                  )}

                  {/* Balance Row */}
                  <div className="flex items-center justify-between bg-black/20 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs opacity-70">Balance</p>
                      <button
                        onClick={() => toggleBalanceVisibility(account.id)}
                        className="opacity-70 hover:opacity-100 transition-all"
                      >
                        {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-xl font-bold">
                      {isVisible ? formatCurrency(account.balance) : "••••••"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openReport(account)}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Filter size={14} /> Transactions
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADD Modal ── */}
      <BottomSheet
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Bank Account"
      >
        <div className="flex flex-col gap-4 pb-28">
          {" "}
          {/* <-- Add pb-28 to match nav height */}
          <AccountForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          <Button onClick={handleAdd} fullWidth size="lg">
            Add Account
          </Button>
        </div>
      </BottomSheet>

      {/* ── EDIT Modal ── */}
      <BottomSheet
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAccount(null);
          resetForm();
        }}
        title="Edit Account"
      >
        <div className="space-y-5">
          <AccountForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          <Button onClick={handleEdit} fullWidth size="lg">
            Update Account
          </Button>
        </div>
      </BottomSheet>

      {/* ── REPORT Modal ── */}
      <BottomSheet
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setSelectedAccount(null);
        }}
        title={
          selectedAccount ? `${selectedAccount.bankName} Report` : "Report"
        }
      >
        {selectedAccount && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight size={16} className="text-green-400" />
                  <span className="text-xs text-green-400 font-medium">
                    Total Income
                  </span>
                </div>
                <p className="text-lg font-bold text-green-400">
                  {formatCurrency(reportIncome)}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownRight size={16} className="text-red-400" />
                  <span className="text-xs text-red-400 font-medium">
                    Total Expenses
                  </span>
                </div>
                <p className="text-lg font-bold text-red-400">
                  {formatCurrency(reportExpense)}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-dark-bg rounded-xl">
              {["all", "income", "expense"].map((f) => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${reportFilter === f ? "bg-purple-500 text-white" : "text-gray-400"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Transaction List */}
            {reportTransactions.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                No transactions for this account
              </p>
            ) : (
              <div className="space-y-2">
                {reportTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 bg-dark-bg rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {t.description || t.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default BankAccounts;

// const AccountForm = ({
//   formData = {},
//   setFormData = () => {},
//   errors = {},
// }) => (
//   <div className="space-y-4">
//     <Input
//       label="Bank Name"
//       value={formData.bankName}
//       onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
//       error={errors.bankName}
//     />

//     <Input
//       label="Account Holder"
//       value={formData.accountHolder}
//       onChange={(e) =>
//         setFormData({ ...formData, accountHolder: e.target.value })
//       }
//       error={errors.accountHolder}
//     />

//     <Input
//       label="Account Number"
//       value={formData.accountNumber}
//       onChange={(e) =>
//         setFormData({
//           ...formData,
//           accountNumber: e.target.value.replace(/\D/g, ""),
//         })
//       }
//       error={errors.accountNumber}
//     />

//     <Input
//       label="Current Balance"
//       type="number"
//       value={formData.balance}
//       onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
//       error={errors.balance}
//     />
//   </div>
// );
const AccountForm = ({ formData, setFormData, errors }) => (
  <div className="space-y-4">
    <Input
      label="Bank Name"
      value={formData.bankName}
      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
      error={errors.bankName}
    />

    <Input
      label="Account Holder"
      value={formData.accountHolder}
      onChange={(e) =>
        setFormData({ ...formData, accountHolder: e.target.value })
      }
      error={errors.accountHolder}
    />

    <Input
      label="Account Number"
      value={formData.accountNumber}
      onChange={(e) =>
        setFormData({
          ...formData,
          accountNumber: e.target.value.replace(/\D/g, ""),
        })
      }
      error={errors.accountNumber}
    />

    <Input
      label="IFSC Code"
      value={formData.ifsc}
      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
    />

    <Input
      label="Branch"
      value={formData.branch}
      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
    />

    <Input
      label="Current Balance"
      type="number"
      value={formData.balance}
      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
      error={errors.balance}
    />
  </div>
);
