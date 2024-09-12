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
      <h1 className="text-center text-7xl">Recall - Prototype</h1>
      <div className="mt-24 flex min-w-[320px] flex-col justify-center self-center">
        <h2 className="text-center text-2xl">Log in</h2>
        <Auth
          supabaseClient={client}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  );
}
