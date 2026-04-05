import { useEffect, useState } from "react";
import { defaultCmsContent, fetchPublicCmsContent, type CmsContent } from "@/lib/cms";

export const useCmsContent = () => {
  const [content, setContent] = useState<CmsContent>(defaultCmsContent);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        const cmsContent = await fetchPublicCmsContent();

        if (!cancelled) {
          setContent(cmsContent);
        }
      } catch {
        // Keep defaults on request failure.
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
};
