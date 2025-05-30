"use client"

import * as React from "react"

export type DataConfig = typeof dataConfig

export const dataConfig = {
  speicalTricks: [
    {
      id: crypto.randomUUID(),
      name: "The 900",
      points: 9000,
      description: "A two-and-a-half-revolution spin in the air",
      difficulty: "Expert",
      style: "Vert",
    },
    {
      id: crypto.randomUUID(),
      name: "Indy Backflip",
      points: 4000,
      description: "An Indy grab combined with a backflip",
      difficulty: "Advanced",
      style: "Vert",
    },
    {
      id: crypto.randomUUID(),
      name: "Pizza Guy",
      points: 1500,
      description: "A quirky, stylish grab trick",
      difficulty: "Intermediate",
      style: "Grab",
    },
    {
      id: crypto.randomUUID(),
      name: "360 Varial McTwist",
      points: 5000,
      description: "A 360-degree spin with a Varial and McTwist",
      difficulty: "Expert",
      style: "Vert",
    },
    {
      id: crypto.randomUUID(),
      name: "Kickflip Backflip",
      points: 3000,
      description: "A Kickflip combined with a backflip",
      difficulty: "Advanced",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "FS 540",
      points: 4500,
      description: "A frontside 540-degree spin",
      difficulty: "Advanced",
      style: "Vert",
    },
    {
      id: crypto.randomUUID(),
      name: "Ghetto Bird",
      points: 3500,
      description: "A Hardflip late 180",
      difficulty: "Intermediate",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "Casper Flip 360 Flip",
      points: 2500,
      description: "A Casper Flip combined with a 360 Flip",
      difficulty: "Advanced",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "Christ Air",
      points: 6000,
      description:
        "A grab trick where the skater spreads their arms like a cross",
      difficulty: "Expert",
      style: "Grab",
    },
    {
      id: crypto.randomUUID(),
      name: "Hardflip",
      points: 2000,
      description: "A combination of a Kickflip and a frontside shove-it",
      difficulty: "Intermediate",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "Heelflip",
      points: 1500,
      description: "A flip trick using the heel of the front foot",
      difficulty: "Intermediate",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "Benihana",
      points: 3000,
      description: "A stylish one-footed grab trick",
      difficulty: "Advanced",
      style: "Grab",
    },
    {
      id: crypto.randomUUID(),
      name: "Judo Air",
      points: 3500,
      description:
        "A grab trick with a leg kick similar to a martial arts move",
      difficulty: "Advanced",
      style: "Grab",
    },
    {
      id: crypto.randomUUID(),
      name: "Laser Flip",
      points: 4000,
      description: "A combination of a 360 Heelflip and a 360 shove-it",
      difficulty: "Expert",
      style: "Flip",
    },
    {
      id: crypto.randomUUID(),
      name: "McTwist",
      points: 5000,
      description: "A 540-degree flip with a grab",
      difficulty: "Expert",
      style: "Vert",
    },
    {
      id: crypto.randomUUID(),
      name: "Impossible",
      points: 2500,
      description: "A flip trick where the board wraps around the back foot",
      difficulty: "Advanced",
      style: "Flip",
    },
  ],
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table"
import { CsvImporter } from "@/shadcn/components/csv-importer"

export function TricksTable() {
  const [data, setData] = React.useState(dataConfig.speicalTricks)

  return (
    <div className="flex flex-col gap-4">
      <CsvImporter
        fields={[
          { label: "Name", value: "name", required: true },
          { label: "Description", value: "description" },
          { label: "Points", value: "points" },
          { label: "Difficulty", value: "difficulty" },
          { label: "Style", value: "style" },
        ]}
        onImport={(parsedData) => {
          const formattedData: DataConfig["speicalTricks"] = parsedData.map(
            (item) => ({
              id: crypto.randomUUID(),
              name: String(item.name ?? ""),
              description: String(item.description ?? ""),
              points: Number.isNaN(Number(item.points))
                ? 0
                : Number(item.points),
              difficulty: String(item.difficulty ?? ""),
              style: String(item.style ?? ""),
            })
          )

          setData((prev) => [...prev, ...formattedData])
        }}
        className="self-end"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Style</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <span className="line-clamp-1">{item.name}</span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1">{item.description}</span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1">{item.points}</span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1">{item.difficulty}</span>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1">{item.style}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}