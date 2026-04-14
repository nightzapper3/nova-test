import novaLogo from "@/assets/nova-logo.png";

const ThinkingIndicator = () => {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1 overflow-hidden">
        <img src={novaLogo} alt="Nova" className="h-6 w-6 object-contain animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="flex items-center gap-1 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms] [animation-duration:1s]" />
          <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms] [animation-duration:1s]" />
          <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms] [animation-duration:1s]" />
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
