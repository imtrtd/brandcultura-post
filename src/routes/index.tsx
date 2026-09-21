import { createFileRoute } from "@tanstack/react-router";
import { CarouselEditor } from "@/components/carousel/editor";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CarouselEditor />;
}
