import { Logo } from "@/components";

const AuthPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full w-full max-w-6xl flex-col gap-8 sm:grid sm:grid-cols-[40%_60%]">
      <div>
        <Logo theme="dark" />
      </div>

      <div className="group/form-container flex h-full max-h-[800px] items-center justify-end sm:relative">
        <div className="invisible absolute h-[90%] w-full cursor-pointer rounded-2xl bg-BlackHaze-800 transition-transform hover:-translate-x-10 sm:visible" />
        <div className="z-10 box-border flex h-full w-full items-center justify-center rounded-2xl bg-white p-4 shadow-md transition-transform group-hover/form-container:scale-105 sm:w-[95%]">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthPagesLayout;
