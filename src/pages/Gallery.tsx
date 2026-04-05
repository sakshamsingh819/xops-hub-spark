import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

type GalleryCategory =
  | "all"
  | "workshops"
  | "hackathons"
  | "technical-events"
  | "projects"
  | "fun-activities";

const galleryFolders: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "workshops", label: "Workshops" },
  { value: "hackathons", label: "Hackathons" },
  { value: "technical-events", label: "Technical Events" },
  { value: "projects", label: "Projects" },
  { value: "fun-activities", label: "Fun Activities" },
];

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
}

const galleryImages: GalleryImage[] = [];

const Gallery = () => {
  const [selectedFolder, setSelectedFolder] = useState<GalleryCategory>("all");

  const filteredImages =
    selectedFolder === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.category === selectedFolder);

  return (
    <Layout>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Club <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A visual timeline of X-Ops moments, events, and community highlights.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {galleryFolders.map((folder) => (
              <button
                key={folder.value}
                onClick={() => setSelectedFolder(folder.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedFolder === folder.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {folder.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <figure
                key={image.src}
                className="glass rounded-xl overflow-hidden card-hover"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <p className="text-sm text-muted-foreground mt-6">
              No photos in this folder yet.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
