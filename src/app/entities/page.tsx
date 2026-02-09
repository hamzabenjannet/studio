"use client";

import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type AttributeType = "string" | "number" | "boolean" | "date";

interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
}

interface Entity {
  id: string;
  name: string;
  attributes: Attribute[];
}

const ATTRIBUTE_TYPES: AttributeType[] = [
  "string",
  "number",
  "boolean",
  "date",
];

const baseAttributes: Omit<Attribute, "id">[] = [
  { name: "_id", type: "string" },
  { name: "created_at", type: "date" },
  { name: "updated_at", type: "date" },
  { name: "archived_at", type: "date" },
  { name: "deleted_at", type: "date" },
  { name: "status", type: "string" },
];

function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: "entity-1",
      name: "User",
      attributes: [
        { id: "attr-1-1", name: "inputText1", type: "string" },
        { id: "attr-1-2", name: "inputText2", type: "string" },
        { id: "attr-1-3", name: "inputTextDate1", type: "date" },
      ],
    },
    {
      id: "entity-2",
      name: "Vehicle",
      attributes: [
        { id: "attr-2-1", name: "make", type: "string" },
        { id: "attr-2-2", name: "model", type: "string" },
        { id: "attr-2-3", name: "year", type: "number" },
        { id: "attr-2-4", name: "vin", type: "string" },
      ],
    },
  ]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(
    entities[0] || null,
  );

  const handleAddNewEntity = () => {
    const newId = `entity-${Date.now()}`;
    const newEntity: Entity = {
      id: newId,
      name: "New Entity",
      attributes: baseAttributes.map((attr, index) => ({
        ...attr,
        id: `attr-${newId}-${index + 1}`,
      })),
    };
    setEntities([...entities, newEntity]);
    setSelectedEntity(newEntity);
  };

  const handleEntityNameChange = (entityId: string, newName: string) => {
    const updatedEntities = entities.map((e) =>
      e.id === entityId ? { ...e, name: newName } : e,
    );
    setEntities(updatedEntities);
    if (selectedEntity?.id === entityId) {
      setSelectedEntity((prev) => (prev ? { ...prev, name: newName } : null));
    }
  };

  const handleAddNewAttribute = () => {
    if (!selectedEntity) return;
    const newAttribute: Attribute = {
      id: `attr-${Date.now()}`,
      name: `newAttribute`,
      type: "string",
    };
    const updatedEntity = {
      ...selectedEntity,
      attributes: [...selectedEntity.attributes, newAttribute],
    };
    setSelectedEntity(updatedEntity);
    setEntities(
      entities.map((e) => (e.id === selectedEntity.id ? updatedEntity : e)),
    );
  };

  const handleAttributeChange = (
    attrIndex: number,
    field: "name" | "type",
    value: string,
  ) => {
    if (!selectedEntity) return;
    const updatedAttributes = [...selectedEntity.attributes];
    updatedAttributes[attrIndex] = {
      ...updatedAttributes[attrIndex],
      [field]: value,
    };

    const updatedEntity = { ...selectedEntity, attributes: updatedAttributes };
    setSelectedEntity(updatedEntity);
    setEntities(
      entities.map((e) => (e.id === selectedEntity.id ? updatedEntity : e)),
    );
  };

  const handleRemoveAttribute = (attrId: string) => {
    if (!selectedEntity) return;
    const updatedAttributes = selectedEntity.attributes.filter(
      (a) => a.id !== attrId,
    );
    const updatedEntity = { ...selectedEntity, attributes: updatedAttributes };
    setSelectedEntity(updatedEntity);
    setEntities(
      entities.map((e) => (e.id === selectedEntity.id ? updatedEntity : e)),
    );
  };

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">
                Entity Management
              </h1>
              <p className="text-muted-foreground">
                Define and manage your application's data structures.
              </p>
            </div>
            <Button onClick={handleAddNewEntity}>
              <Plus className="mr-2 h-4 w-4" /> Add Entity
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Entities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {entities.map((entity) => (
                    <li key={entity.id}>
                      <Button
                        variant={
                          selectedEntity?.id === entity.id
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start"
                        onClick={() =>
                          setSelectedEntity(
                            entities.find((e) => e.id === entity.id) || null,
                          )
                        }
                      >
                        {entity.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="md:col-span-3">
              {selectedEntity ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="entity-name" className="text-lg">
                        Entity Name:
                      </Label>
                      <Input
                        id="entity-name"
                        className="text-2xl font-semibold leading-none tracking-tight w-1/2"
                        value={selectedEntity.name}
                        onChange={(e) =>
                          handleEntityNameChange(
                            selectedEntity.id,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <CardDescription>
                      Manage the attributes for the "{selectedEntity.name}"
                      entity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedEntity.attributes.map((attr, index) => (
                      <div
                        key={attr.id}
                        className="grid grid-cols-10 gap-2 items-center"
                      >
                        <div className="col-span-4">
                          <Label htmlFor={`attr-name-${attr.id}`}>
                            Attribute Name
                          </Label>
                          <Input
                            id={`attr-name-${attr.id}`}
                            value={attr.name}
                            onChange={(e) =>
                              handleAttributeChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-span-4">
                          <Label htmlFor={`attr-type-${attr.id}`}>
                            Attribute Type
                          </Label>
                          <Select
                            value={attr.type}
                            onValueChange={(value: string) =>
                              handleAttributeChange(index, "type", value)
                            }
                          >
                            <SelectTrigger id={`attr-type-${attr.id}`}>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ATTRIBUTE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 flex items-end h-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttribute(attr.id)}
                            aria-label="Remove attribute"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={handleAddNewAttribute}>
                      <Plus className="mr-2 h-4 w-4" /> Add Attribute
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 py-32">
                  <p className="text-muted-foreground">
                    Select an entity to view its details or add a new one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(EntitiesPage);
