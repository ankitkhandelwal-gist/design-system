import { defineMeta } from "../../meta/defineMeta";

export default defineMeta({
  component: {
    name: "Snackbar",
    category: "molecules",
    type: "display",
    description:
      "A short dark message about something that just happened, with a colored bar on the left that shows its type (info, success, danger, warning), an icon, optional heading and up to two actions. Use for feedback after an action, such as 'Report exported' or 'Could not save'.",
    path: "src/components/Snackbar",
    figma: { nodeId: "1468:16185" },
  },

  props: {
    type: { type: "SnackbarType", default: "info", description: "Message type: sets the bar color, default icon and how screen readers announce it. Figma: State (Danger is danger)." },
    heading: { type: "string", description: "Bold first line; omit to hide. Figma: Heading, Show Heading." },
    description: { type: "ReactNode", required: true, description: "The message. Figma: Supporting text." },
    showIcon: { type: "boolean", default: true, description: "Show or hide the icon. Figma: Show Icon." },
    icon: { type: "ReactNode", description: "Replaces the default icon of the type. Decorative. Figma: icon swap." },
    onDismiss: { type: "() => void", description: "Called on Dismiss or when duration ends." },
    showDismiss: { type: "boolean", default: true, description: "Show the Dismiss button (needs onDismiss). Set false to close only by duration. Figma: Show Dismiss." },
    dismissLabel: { type: "string", default: "Dismiss", description: "Dismiss button text. Figma: Dismiss label." },
    onAction: { type: "() => void", description: "Called on the action button. The button shows only when this is set. Figma: Show Action." },
    actionLabel: { type: "string", default: "Action", description: "Action button text, e.g. Undo or View. Figma: Action label." },
    duration: { type: "number", description: "Milliseconds until onDismiss is called automatically. Pauses on hover and focus. Unset keeps it until dismissed." },
  },

  variants: {
    axes: {
      type: ["info", "success", "danger", "warning"] as const,
    },
    purpose: {
      "type.info": "Neutral news: a background task started, a setting changed.",
      "type.success": "An action completed: saved, exported, sent.",
      "type.danger": "An action failed or needs attention now: could not save, upload failed.",
      "type.warning": "Something may go wrong soon or partly worked: nearing a limit, some rows skipped.",
    },
  },

  relationships: {
    commonPartners: ["Button"],
    triggers: ["onDismiss", "onAction"],
    exposesState: [],
    role: "status for info and success (polite); alert for danger and warning (assertive).",
    keyboardSupport: "Dismiss and the action button are buttons: Tab to reach them, Enter or Space to press. The auto-dismiss timer pauses while focus is inside.",
    screenReader:
      "Announced when it appears: info and success politely, danger and warning immediately. The accent color is not announced, so say the type in the heading or message when it matters.",
  },

  tokens: {
    color: {
      background: "--ds-color-snackbar-bg",
      text: "--ds-color-snackbar-text",
      icon: "--ds-color-snackbar-icon",
      "action.bg": "--ds-color-snackbar-action-button-bg",
      "bar.info": "--ds-color-snackbar-info-bg",
      "bar.success": "--ds-color-snackbar-success-bg",
      "bar.danger": "--ds-color-snackbar-error-bg",
      "bar.warning": "--ds-color-snackbar-warning-bg",
      "focus-ring": "--ds-color-border-primary-focus (not in Figma)",
    },
    spacing: { padding: "--ds-spacing-6", gap: "--ds-spacing-5", "content-gap": "--ds-spacing-2", "actions-gap": "--ds-spacing-4" },
    radius: { body: "--ds-radius-md", button: "--ds-radius-md" },
    typography: { heading: "ds-text-body-14-semibold", description: "ds-text-body-14-regular", button: "ds-text-body-14-medium" },
    size: { width: "420px (Figma, no token), shrinks to its container", bar: "6px (Figma, no token)", icon: "--ds-icon-size-medium" },
    motion: { enter: "280ms slide + fade (not in Figma)", exit: "180ms, play by setting data-exiting before unmounting", direction: "--ds-snackbar-enter-x / --ds-snackbar-enter-y on a parent" },
    shadow: { body: "0 4px 12px 10% black (Figma, no matching token)" },
  },

  aiHints: {
    priority: "high",
    keywords: ["snackbar", "toast", "notification", "feedback", "message", "alert message", "undo", "saved", "error message"],
    selectionCriteria: {
      type: "Pick by outcome: success when it worked, danger when it failed, warning when it worked partly or may fail, info for everything else.",
      onDismiss: "Always pass it so the user can close the message; needed for duration too.",
      onAction: "Only for one clear next step such as Undo or View.",
      duration: "About 5000 for success and info. Leave unset for danger so the user can read and act.",
    },
    usage: {
      useCases: ["Confirm a saved or exported item", "Report a failed request", "Offer Undo after a delete"],
      commonPatterns: [
        { name: "Confirmation", composition: "Snackbar[type=success][description][onDismiss][duration=5000]" },
        { name: "Undo", composition: "Snackbar[type=info][description][onAction][actionLabel=Undo][onDismiss]" },
        { name: "Failure", composition: "Snackbar[type=danger][heading][description][onDismiss]" },
      ],
      antiPatterns: [
        {
          scenario: "Field validation errors",
          reason: "The message disappears and is far from the field.",
          alternative: "Use InputField status error with helper text.",
        },
        {
          scenario: "Blocking decisions that need a choice",
          reason: "A snackbar can time out or be dismissed without an answer.",
          alternative: "Use a dialog.",
        },
        {
          scenario: "Persistent page-level information",
          reason: "It is for momentary feedback, not a permanent banner.",
          alternative: "Use an inline Alert.",
        },
      ],
    },
  },
});
