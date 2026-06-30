import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent } from 'ngx-quill';

export interface CommentData {
  title?: string;
  comment?: string;          // existing comment HTML (edit mode)
  followUp?: Date | null;
}

export interface CommentResult {
  comment: string;           // HTML
  followUp: Date | null;     // combined date + time
}

type Meridiem = 'AM' | 'PM';

/** Quill can emit "<p><br></p>" for an empty editor — require real text. */
function commentNotEmpty(control: AbstractControl) {
  const text = (control.value ?? '').replace(/<[^>]*>/g, '').trim();
  return text.length ? null : { required: true };
}

function to24Hour(hour: number, meridiem: Meridiem): number {
  if (meridiem === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function combine(date: Date, hour: number, minute: number, meridiem: Meridiem): Date {
  return new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    to24Hour(hour, meridiem), minute
  );
}

/** Group validator: the chosen date + time must not be in the past. */
function notInPast(group: AbstractControl): ValidationErrors | null {
  const date = group.get('followDate')?.value as Date | null;
  const hour = group.get('hour')?.value as number | null;
  const minute = group.get('minute')?.value as number | null;
  const meridiem = group.get('meridiem')?.value as Meridiem | null;
  if (!date || hour == null || minute == null || !meridiem) return null;
  const nowToMinute = new Date();
  nowToMinute.setSeconds(0, 0);   // compare at minute granularity, not seconds
  return combine(date, hour, minute, meridiem).getTime() < nowToMinute.getTime()
    ? { pastTime: true }
    : null;
}

@Component({
  selector: 'app-comment-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    QuillEditorComponent,
  ],
  templateUrl: './comment-dialog.html',
  styleUrl: './comment-dialog.css',
})
export class CommentDialog {
  private dialogRef = inject(MatDialogRef<CommentDialog>);
  data: CommentData = inject(MAT_DIALOG_DATA) ?? {};

  // earliest selectable follow-up date (today; no past dates)
  minDate = new Date();

  hours = Array.from({ length: 12 }, (_, i) => i + 1);          // 1..12
  minutes = Array.from({ length: 60 }, (_, i) => i);            // 0..59 (every minute)
  meridiems: Meridiem[] = ['AM', 'PM'];

  form = new FormGroup(
    {
      comment: new FormControl<string | null>(this.data.comment ?? null, commentNotEmpty),
      followDate: new FormControl<Date | null>(this.data.followUp ?? new Date(), Validators.required),
      hour: new FormControl<number | null>(null, Validators.required),
      minute: new FormControl<number | null>(null, Validators.required),
      meridiem: new FormControl<Meridiem | null>(null, Validators.required),
    },
    { validators: notInPast }
  );

  // Quill toolbar — bold / italic / underline + ordered & bullet lists
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  constructor() {
    // seed hour/minute/meridiem from the existing follow-up (edit) or now (add)
    const d = this.data.followUp ?? new Date();
    const h = d.getHours();
    this.form.patchValue({
      hour: h % 12 || 12,
      minute: d.getMinutes(),
      meridiem: h >= 12 ? 'PM' : 'AM',
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) return;
    const { comment, followDate, hour, minute, meridiem } = this.form.getRawValue();
    const followUp = combine(followDate!, hour!, minute!, meridiem!);
    this.dialogRef.close({ comment: comment ?? '', followUp } satisfies CommentResult);
  }
}
