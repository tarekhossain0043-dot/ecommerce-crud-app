import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "product-management-items";
const PAGE_SIZE = 5;
const categories = [
  "Electronics",
  "Home & Kitchen",
  "Accessories",
  "Clothing",
  "Other",
];

const starterProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    created: "2024-11-15",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 299.99,
    category: "Electronics",
    created: "2024-11-20",
  },
  {
    id: 3,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 79.99,
    category: "Home & Kitchen",
    created: "2024-11-25",
  },
];

function readProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterProducts;
  } catch (error) {
    console.error("Could not load saved products:", error);
    return starterProducts;
  }
}

function Icon({ name, size = 18, className = "" }) {
  const paths = {
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    box: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    filter: (
      <>
        <path d="M4 7h16M7 12h10m-7 5h4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US");
}

function ProductForm({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    () =>
      product ?? {
        name: "",
        description: "",
        price: "",
        category: categories[0],
      },
  );
  const editing = Boolean(product);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
    });
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="form-title"
        aria-modal="true"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20"
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Product catalog
            </p>
            <h2
              className="text-xl font-semibold tracking-tight text-slate-900"
              id="form-title"
            >
              {editing ? "Edit product" : "Add a new product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the details for this product."
                : "Fill in the details to add it to your catalog."}
            </p>
          </div>
          <button
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <form className="space-y-4 px-6 py-5" onSubmit={submitForm}>
          <label className="block text-sm font-medium text-slate-700">
            Product name
            <input
              autoFocus
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              maxLength="80"
              name="name"
              onChange={updateField}
              placeholder="e.g. Wireless Headphones"
              required
              value={form.name}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              maxLength="240"
              name="description"
              onChange={updateField}
              placeholder="What makes this product special?"
              required
              value={form.description}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Price ($)
              <input
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                min="0.01"
                name="price"
                onChange={updateField}
                placeholder="0.00"
                required
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Category
              <select
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                name="category"
                onChange={updateField}
                value={form.category}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              type="submit"
            >
              {editing ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(readProducts);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [page, setPage] = useState(1);
  const [formProduct, setFormProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState(null);

  function commitProducts(nextProducts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      setProducts(nextProducts);
      return true;
    } catch (error) {
      console.error("Could not save products:", error);
      setToast({
        message: "Changes could not be saved to this browser.",
        kind: "error",
      });
      return false;
    }
  }

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === "All categories" ||
        product.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, categoryFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const firstItem =
    filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, filteredProducts.length);

  function saveProduct(product) {
    if (product.id) {
      if (
        !commitProducts(
          products.map((item) => (item.id === product.id ? product : item)),
        )
      )
        return;
      setToast({ message: `${product.name} was updated.`, kind: "success" });
    } else {
      if (
        !commitProducts([
          {
            ...product,
            id: Date.now(),
            created: new Date().toISOString().slice(0, 10),
          },
          ...products,
        ])
      )
        return;
      setPage(1);
      setToast({
        message: `${product.name} was added to your products.`,
        kind: "success",
      });
    }
    setIsCreating(false);
    setFormProduct(null);
  }

  function deleteProduct(product) {
    if (!commitProducts(products.filter((item) => item.id !== product.id)))
      return;
    setToast({
      message: `${product.name} was deleted.`,
      kind: "success",
      undoProduct: product,
    });
  }

  function undoDelete() {
    if (!toast?.undoProduct) return;
    if (!commitProducts([toast.undoProduct, ...products])) return;
    setToast({ message: "Product restored.", kind: "success" });
  }

  function updateFilters(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Icon name="box" size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                Store admin
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Product management
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Create, organize, and keep your product catalog up to date.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your products
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {products.length} {products.length === 1 ? "item" : "items"} in
                your catalog
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              onClick={() => setIsCreating(true)}
              type="button"
            >
              <Icon name="plus" size={19} />
              Add new item
            </button>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:p-5">
            <label className="relative block flex-1">
              <span className="sr-only">Search products</span>
              <Icon
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                name="search"
                size={18}
              />
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(event) =>
                  updateFilters(setQuery, event.target.value)
                }
                placeholder="Search products..."
                type="search"
                value={query}
              />
            </label>
            <label className="relative block sm:w-56">
              <span className="sr-only">Filter by category</span>
              <Icon
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                name="filter"
                size={18}
              />
              <select
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(event) =>
                  updateFilters(setCategoryFilter, event.target.value)
                }
                value={categoryFilter}
              >
                <option>All categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                ▼
              </span>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-white text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleProducts.map((product) => (
                  <tr
                    className="group transition hover:bg-slate-50/80"
                    key={product.id}
                  >
                    <td className="max-w-52 px-5 py-4">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {product.name}
                      </span>
                    </td>
                    <td className="max-w-72 px-5 py-4">
                      <span
                        className="block truncate text-sm text-slate-500"
                        title={product.description}
                      >
                        {product.description}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
                        {product.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {formatDate(product.created)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          onClick={() => setFormProduct(product)}
                          type="button"
                        >
                          <Icon name="edit" size={17} />
                        </button>
                        <button
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => deleteProduct(product)}
                          type="button"
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td className="px-5 py-16 text-center" colSpan="6">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Icon name="search" size={22} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No products found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or category filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {firstItem}-{lastItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
            <nav aria-label="Product pages" className="flex items-center gap-1">
              <button
                aria-label="Previous page"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                <Icon name="left" size={17} />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                      page === pageNumber
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    type="button"
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                aria-label="Next page"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page >= pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                type="button"
              >
                <Icon name="right" size={17} />
              </button>
            </nav>
          </footer>
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">
          Product changes are saved in this browser.
        </p>
      </div>

      {(isCreating || formProduct) && (
        <ProductForm
          onClose={() => {
            setIsCreating(false);
            setFormProduct(null);
          }}
          onSave={saveProduct}
          product={formProduct}
        />
      )}

      {toast && (
        <div
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
            toast.kind === "error"
              ? "border-rose-200 bg-white text-rose-700"
              : "border-slate-200 bg-white text-slate-700"
          }`}
          role="status"
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              toast.kind === "error"
                ? "bg-rose-50 text-rose-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <Icon name={toast.kind === "error" ? "close" : "check"} size={16} />
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
          {toast.undoProduct && (
            <button
              className="ml-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              onClick={undoDelete}
              type="button"
            >
              Undo
            </button>
          )}
          <button
            aria-label="Dismiss notification"
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={() => setToast(null)}
            type="button"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
