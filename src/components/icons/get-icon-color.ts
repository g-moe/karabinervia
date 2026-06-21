export default function getIconColor(isSelected: boolean) {
  return {
    style: {
      color: isSelected
        ? "var(--color_control-background-hover)"
        : "var(--color_control-background)",
    },
  };
}
