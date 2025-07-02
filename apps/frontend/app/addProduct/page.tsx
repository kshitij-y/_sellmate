"use client";

import { useState, useEffect } from "react";

type Category = {
  id: string;
  cat_name: string;
};

type VariationOption = {
  id: string;
  value: string;
};

type Variation = {
  id: string;
  name: string;
  options: VariationOption[];
};

type ProductItem = {
  id: string;
  sku: string;
  price: number;
  quantity: number;
  variationOptionIds: string[]; // one option id per variation
  images: { url: string; position: number }[];
};

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [variations, setVariations] = useState<Variation[]>([]);

  // Product fields
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [items, setItems] = useState<ProductItem[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch variations when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setVariations([]);
      setItems([]);
      return;
    }
    fetch(`/api/categories/${selectedCategoryId}/variations`)
      .then((res) => res.json())
      .then(setVariations)
      .catch(() => setVariations([]));
    setItems([]);
  }, [selectedCategoryId]);

  // Add a new empty product item (SKU)
  const addNewItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sku: "",
        price: 0,
        quantity: 0,
        variationOptionIds: Array(variations.length).fill(""),
        images: [],
      },
    ]);
  };

  // Update SKU, price, quantity
  const updateItemField = (
    itemId: string,
    field: keyof ProductItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // Update selected variation option for product item
  const updateVariationOption = (
    itemId: string,
    variationIndex: number,
    optionId: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedOptions = [...item.variationOptionIds];
          updatedOptions[variationIndex] = optionId;
          return { ...item, variationOptionIds: updatedOptions };
        }
        return item;
      })
    );
  };

  // Add image URL with position for product item
  const addImageToItem = (itemId: string, url: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const position = item.images.length + 1;
          return { ...item, images: [...item.images, { url, position }] };
        }
        return item;
      })
    );
  };

  // Remove image by position
  const removeImageFromItem = (itemId: string, position: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const filtered = item.images.filter(
            (img) => img.position !== position
          );
          // reassign positions to maintain order
          const reordered = filtered.map((img, i) => ({
            url: img.url,
            position: i + 1,
          }));
          return { ...item, images: reordered };
        }
        return item;
      })
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    // Basic validation
    if (!productName || !selectedCategoryId || items.length === 0) {
      alert("Please fill product name, category and add at least one variant.");
      return;
    }

    // Validate items have SKU, price, quantity, and selected variation options
    for (const item of items) {
      if (!item.sku) {
        alert("Each variant must have SKU.");
        return;
      }
      if (item.price <= 0) {
        alert("Price must be > 0.");
        return;
      }
      if (item.quantity < 0) {
        alert("Quantity can't be negative.");
        return;
      }
      if (item.variationOptionIds.some((optId) => !optId)) {
        alert("Please select all variation options for each variant.");
        return;
      }
    }

    const payload = {
      name: productName,
      description: productDescription,
      categoryId: selectedCategoryId,
      items: items.map(({ id, ...rest }) => rest), // exclude local id
    };

    console.log("Submitting product payload:", payload);

    // TODO: call your API here
    // await fetch('/api/products', { method: 'POST', body: JSON.stringify(payload) })
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Add Product</h1>

      {/* Product basic info */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="input input-bordered w-full max-w-xl"
        />
        <textarea
          placeholder="Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="textarea textarea-bordered w-full max-w-xl"
          rows={3}
        />
        <select
          className="select select-bordered max-w-xs"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.cat_name}
            </option>
          ))}
        </select>
      </div>

      {/* Variations info + product items */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Variants</h2>
        <button className="btn btn-outline mb-4" onClick={addNewItem}>
          + Add Variant
        </button>

        {items.length === 0 && <p>No variants added yet.</p>}

        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded mb-6 bg-black shadow-sm">
            <div className="flex flex-wrap gap-4 items-center mb-3">
              <input
                type="text"
                placeholder="SKU"
                value={item.sku}
                onChange={(e) =>
                  updateItemField(item.id, "sku", e.target.value)
                }
                className="input input-bordered max-w-xs"
              />
              <input
                type="number"
                placeholder="Price"
                min={0}
                step={0.01}
                value={item.price}
                onChange={(e) =>
                  updateItemField(
                    item.id,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="input input-bordered max-w-xs"
              />
              <input
                type="number"
                placeholder="Quantity"
                min={0}
                value={item.quantity}
                onChange={(e) =>
                  updateItemField(
                    item.id,
                    "quantity",
                    parseInt(e.target.value) || 0
                  )
                }
                className="input input-bordered max-w-xs"
              />
            </div>

            {/* Variation options selects */}
            <div className="flex flex-wrap gap-4 mb-3">
              {variations.map((variation, idx) => (
                <div key={variation.id} className="flex flex-col">
                  <label className="font-medium">{variation.name}</label>
                  <select
                    className="select select-bordered max-w-xs"
                    value={item.variationOptionIds[idx] || ""}
                    onChange={(e) =>
                      updateVariationOption(item.id, idx, e.target.value)
                    }>
                    <option value="">Select {variation.name}</option>
                    {variation.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Images input */}
            <ImagesInput
              item={item}
              addImageToItem={addImageToItem}
              removeImageFromItem={removeImageFromItem}
            />
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Product
      </button>
    </div>
  );
}

function ImagesInput({
  item,
  addImageToItem,
  removeImageFromItem,
}: {
  item: ProductItem;
  addImageToItem: (itemId: string, url: string) => void;
  removeImageFromItem: (itemId: string, position: number) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    addImageToItem(item.id, imageUrl.trim());
    setImageUrl("");
  };

  return (
    <div>
      <label className="font-medium block mb-1">Images (URLs)</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Image URL"
          className="input input-bordered flex-grow"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button className="btn btn-sm btn-outline" onClick={handleAddImage}>
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.images.map(({ url, position }) => (
          <div key={position} className="relative border p-1 rounded">
            <img
              src={url}
              alt={`Image ${position}`}
              className="h-20 w-20 object-cover rounded"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs leading-none"
              onClick={() => removeImageFromItem(item.id, position)}
              title="Remove image">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
