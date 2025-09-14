import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";

const UpgradeToProCard = ({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) => {
  return (
    <Dialog modal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <Card className="bg-transparent border-0">
          <CardHeader>
            <CardTitle>Free Tier Limit have been reached</CardTitle>
            <CardDescription>
              You have reached the free tier limit of 3 notes. Upgrade to pro to
              remove the limit.
              <br />
              Pro features:
              <ul className="list-disc list-inside">
                <li>Unlimited notes</li>
              </ul>
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProCard;
