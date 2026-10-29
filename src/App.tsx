import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { StockInView } from './components/StockInView';
import { RepresentativeOrdersView } from './components/RepresentativeOrdersView';
import { MovementLedgerView } from './components/MovementLedgerView';
import { ReportsView } from './components/ReportsView';
import { ResearchStudyView } from './components/ResearchStudyView';
import { ProductModal } from './components/ProductModal';
import { AdjustStockModal } from './components/AdjustStockModal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { Product } from './types';
import { RotateCcw, BookOpen, Check } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, resetToDemoData, products } = useInventory();

  // Modals state
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [stockInInitialProductId, setStockInInitialProductId] = useState<string | null>(null);

  // Quick Restock from Dashboard
  const handleQuickRestock = (productId: string) => {
    setStockInInitialProductId(productId);
    setActiveTab('stock-in');
  };

  // Handle actions from New Transaction modal
  const handleSelectNewTxAction = (
    action: 'stock-in' | 'order' | 'add-product' | 'audit' | 'research'
  ) => {
    if (action === 'stock-in') {
      setActiveTab('stock-in');
    } else if (action === 'order') {
      setActiveTab('orders');
    } else if (action === 'add-product') {
      setEditingProduct(null);
      setIsProductModalOpen(true);
    } else if (action === 'audit') {
      setAdjustingProduct(products[0] || null);
      setIsAdjustModalOpen(true);
    } else if (action === 'research') {
      setActiveTab('research');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenAdjustStock = (product: Product) => {
    setAdjustingProduct(product);
    setIsAdjustModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenNewTransaction={() => setIsNewTxModalOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenStockIn={() => setActiveTab('stock-in')}
              onOpenNewOrder={() => setActiveTab('orders')}
              onQuickRestock={handleQuickRestock}
            />
          )}

          {activeTab === 'products' && (
            <CatalogView
              onOpenAddProduct={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
              onAdjustStock={handleOpenAdjustStock}
            />
          )}

          {activeTab === 'stock-in' && (
            <StockInView
              initialProductId={stockInInitialProductId}
              onClearInitialProduct={() => setStockInInitialProductId(null)}
            />
          )}

          {activeTab === 'orders' && <RepresentativeOrdersView />}

          {activeTab === 'movements' && <MovementLedgerView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'research' && <ResearchStudyView />}
        </main>
      </div>

      {/* Modals */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onSelectAction={handleSelectNewTxAction}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={adjustingProduct}
      />

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 no-print text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="font-semibold text-neutral-800">
              Avon Product and Inventory Management System
            </p>
            <p className="text-[11px] text-neutral-500">
              Designed for Local Avon Distribution Offices · Grounded in Bandara et al. (2019) research
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('research')}
              className="text-rose-900 hover:underline font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research Paper</span>
            </button>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <button
              onClick={() => {
                if (confirm('Reset inventory database to initial demo dataset?')) {
                  resetToDemoData();
                }
              }}
              className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  );
}
