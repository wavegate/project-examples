import { api } from "@/utils/api";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
  const router = useRouter();

  const pathToLabelMapping: Record<string, string> = {
    dashboard: "Dashboard",
    bugs: "Bugs",
    create: "Create",
    edit: "Edit",
    // Add other mappings here
  };

  let bugId = "";
  const pathSnippets = router.pathname.split("/").filter((i) => i);
  pathSnippets.forEach((snippet, index) => {
    if (snippet === "[id]" && pathSnippets[index - 1] === "bugs") {
      if (typeof router.query.id === "string") {
        bugId = router.query.id;
      }
    }
  });

  const {
    data: bug,
    isLoading,
    error,
  } = api.bug.getById.useQuery({ id: Number(bugId) }, { enabled: !!bugId });

  // Function to generate breadcrumb items from the URL path
  const breadcrumbItems = () => {
    const pathSnippets = router.pathname.split("/").filter((i) => i);
    const asPathSnippets = router.asPath.split("/").filter((i) => i);

    const items = pathSnippets.map((snippet, index) => {
      // Generate URL for each breadcrumb item
      const url = `/${asPathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;
      let label = pathToLabelMapping[snippet] ?? snippet; // Fallback to snippet if no mapping found
      if (snippet === "[id]" && pathSnippets[index - 1] === "bugs" && bug) {
        label = bug.title;
      }

      return (
        <Breadcrumb.Item key={url}>
          {isLast ? <span>{label}</span> : <Link href={url}>{label}</Link>}
        </Breadcrumb.Item>
      );
    });

    // Optionally, add a 'Home' breadcrumb at the beginning
    items.unshift(
      <Breadcrumb.Item key="home">
        <Link href="/">Home</Link>
      </Breadcrumb.Item>,
    );

    return items;
  };

  return <Breadcrumb>{breadcrumbItems()}</Breadcrumb>;
};

export default Breadcrumbs;
