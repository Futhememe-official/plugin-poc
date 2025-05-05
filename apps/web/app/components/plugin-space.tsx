import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Extension } from "@repo/plugin-lib/index";

export const PluginSpace = ({ extension }: { extension: Extension }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{extension?.name?.toLocaleUpperCase()}</CardTitle>
        <p className="text-sm">{extension?.type}</p>
      </CardHeader>
      <CardContent>
        {extension?.policies?.can("create", "Project") ? (
          <Button
            onClick={() =>
              extension?.on?.["create-schedule"]({
                date: new Date(),
                name: "rest",
              })
            }
          >
            Criar Agendamento
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Você não tem permissão para criar um agendamento
          </p>
        )}
      </CardContent>
    </Card>
  );
};
