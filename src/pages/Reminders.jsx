import React from "react";
import { useExpense } from "../hooks/useExpenses";
import ReminderManager from "../components/reminders/ReminderManager";

const Reminders = () => {
  const { reminders, addReminder, removeReminder, toggleReminder } =
    useExpense();

  return (
    <div>
      <ReminderManager
        reminders={reminders}
        onAddReminder={addReminder}
        onDeleteReminder={removeReminder}
        onToggleReminder={toggleReminder}
      />
    </div>
  );
};

export default Reminders;
