import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, Chip } from "@heroui/react";
import { useMemo } from "react";
import axios from "axios";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { products } from "@/data/products"; 

export default function CreateListingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentTagInput, setCurrentTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const availableTags = useMemo(() => {
    const allTags = products.flatMap((product) => product.tags);

    return Array.from(new Set(allTags));
  }, []);

  const suggestions = useMemo(() => {
    if (!currentTagInput) return [];
    const lowerCaseInput = currentTagInput.toLowerCase();

    return availableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(lowerCaseInput) &&
          !selectedTags.includes(tag),
      )
      .slice(0, 5);
  }, [currentTagInput, availableTags, selectedTags]);

  const handleTagInputChange = (e) => {
    setCurrentTagInput(e.target.value);
  };

  const handleSuggestionClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setCurrentTagInput("");
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !name ||
      !description ||
      !price ||
      !imageUrl ||
      selectedTags.length === 0
    ) {
      setError(
        "All fields are required, and at least one tag must be selected.",
      );
      setLoading(false);

      return;
    }

    try {
      const res = await axios.post("/api/create-listing", {
          token: window.localStorage.getItem("authToken"),
          username: window.localStorage.getItem("username"),
          name,
          description,
          price: parseFloat(price),
          image: imageUrl,
          tags: selectedTags,
        });

      if (res.status == 200) {
        setSuccess("Listing created successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setSelectedTags([]);
        setCurrentTagInput("");
      } else {
        const data = await res.json();

        setError(data.error || "Failed to create listing.");
      }
    } catch (_e) {
      console.log(_e);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Create New Listing</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Sell your items to the UIUC community.
          </h2>
        </div>

        <form
          className="flex flex-col gap-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <Input
            fullWidth
            disabled={loading}
            label="Item Name"
            placeholder="e.g., Used Calculus Textbook"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            fullWidth
            disabled={loading}
            label="Description"
            placeholder="e.g., Good condition, minor highlights"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            fullWidth
            disabled={loading}
            label="Price"
            placeholder="e.g., 45.00"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            fullWidth
            disabled={loading}
            label="Image URL"
            placeholder="e.g., https://example.com/image.jpg"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="relative">
            <Input
              fullWidth
              aria-label="Add tags"
              disabled={loading}
              placeholder="Add tags (e.g., books, math)"
              value={currentTagInput}
              onChange={handleTagInputChange}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  currentTagInput &&
                  !selectedTags.includes(currentTagInput)
                ) {
                  handleSuggestionClick(currentTagInput);
                }
              }}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-foreground-100 rounded-lg mt-1 shadow-lg overflow-hidden">
                {suggestions.map((tag) => (
                  <div
                    key={tag}
                    className="p-2 cursor-pointer hover:bg-default"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(tag)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSuggestionClick(tag);
                      }
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Chip color="primary" variant="flat" onClose={() => {handleTagRemove(tag)}}>{tag}</Chip>
              ))}
            </div>
          )}

          <Button color="primary" disabled={loading} type="submit">
            {loading ? "Creating Listing..." : "Create Listing"}
          </Button>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
        </form>
      </section>
    </DefaultLayout>
  );
}