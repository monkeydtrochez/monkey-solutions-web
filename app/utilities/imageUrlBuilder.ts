import imageUrlBuilder from "@sanity/image-url";
import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";

export function buildImageUrlFor(
  sanityClientConfig: SanityClientConfig,
  imageRef: string
) {
  if (!imageRef) {
    console.warn("Warning: imageRef is undefined.");
    return ""; // todo add placeholder image
  }
  try {
    const sanityClient = createClientFromParam(sanityClientConfig);
    const builder = imageUrlBuilder(sanityClient);

    const imageUrl = builder.image(imageRef);

    return imageUrl ? imageUrl.toString() : "";
  } catch (error) {
    console.error("Error building image URL:", error);
    return ""; // todo add placeholder image
  }
}
