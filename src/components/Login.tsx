import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../supabase";
interface LoginProps {
  client: SupabaseClient<Database>;
}

export default function Login({ client }: LoginProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-7xl text-center">ExamGenie</h1>
      <div className="flex flex-col self-center min-w-[320px] justify-center mt-24">
        <h2 className="text-2xl text-center">Log in</h2>
        <Auth
          supabaseClient={client}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  );
}
