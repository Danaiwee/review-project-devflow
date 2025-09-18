import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, ""); //replace the \\ and space with ""
  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => ( //modify the pre tag
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark200"
            />
          ),
        }}
      />
    </section>
  );
};

export default Preview;
