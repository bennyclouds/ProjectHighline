<div
  class="reservation-row"
  draggable="true"
  @dragstart="onDragStart"
>
  {{ reservation.passengerName }}
</div>

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData("reservationId", props.reservation.reservationId);
  e.dataTransfer!.effectAllowed = "copy";
}
