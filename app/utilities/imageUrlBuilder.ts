import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "@/app/sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function buildImageUrlFor(imageRef: string) {
  return builder.image(imageRef);
}
