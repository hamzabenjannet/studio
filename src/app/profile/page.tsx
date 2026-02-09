"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const userAvatar = {
  id: "user-avatar-large",
  description: "User avatar placeholder large",
  imageUrl: "https://picsum.photos/seed/U1/128/128",
  imageHint: "person face",
};

function ProfilePage() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Profil
            </h1>
            <p className="text-muted-foreground">
              Gérez les informations de votre profil.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vos informations</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles et votre avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt={userAvatar.description}
                    data-ai-hint={userAvatar.imageHint}
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button>Changer l'avatar</Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inputText1">Prénom</Label>
                  <Input id="inputText1" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inputText2">Nom</Label>
                  <Input id="inputText2" defaultValue="Dupont" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Sauvegarder les changements</Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(ProfilePage);
