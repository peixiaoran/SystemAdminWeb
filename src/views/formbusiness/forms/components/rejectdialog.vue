<template>
  <el-dialog
    :model-value="visible"
    :title="t(`${i18nPrefix}.rejectDialogTitle`)"
    width="580px"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="modal-penetrable"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
  >
    <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules" label-width="100px">
      <el-form-item :label="t(`${i18nPrefix}.rejectStepLabel`)" prop="rejectStepId">
        <el-select
          v-model="rejectForm.rejectStepId"
          :placeholder="t(`${i18nPrefix}.rejectStepPlaceholder`)"
          class="reject-step-select"
        >
          <el-option
            v-for="step in options"
            :key="step.stepId"
            :label="step.stepName"
            :value="step.stepId"
          >
            <div class="reject-step-option">
              <span class="reject-step-option-name">{{ step.stepName }}</span>
              <span v-if="step.ReviewUserNames || step.reviewUserNames" class="reject-step-option-reviewers">
                {{ step.ReviewUserNames || step.reviewUserNames }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t(`${i18nPrefix}.rejectReasonLabel`)" prop="rejectReason">
        <el-input
          v-model="rejectForm.rejectReason"
          type="textarea"
          :rows="6"
          :placeholder="t(`${i18nPrefix}.rejectReasonPlaceholder`)"
          class="reject-reason-input"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">{{ t('common.cancel') }}</el-button>
      <el-button type="danger" @click="handleConfirm">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import i18n from '@/i18n'

const { t } = i18n.global

const props = defineProps({
  visible: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  i18nPrefix: { type: String, required: true }
})

const emit = defineEmits(['update:visible', 'confirm'])

const rejectFormRef = ref(null)
const rejectForm = reactive({
  rejectStepId: '',
  rejectReason: ''
})

const rejectRules = reactive({
  rejectStepId: [
    { required: true, message: t(`${props.i18nPrefix}.rejectStepRequired`), trigger: 'change' }
  ],
  rejectReason: [
    { required: true, message: t(`${props.i18nPrefix}.rejectReasonRequired`), trigger: 'blur' }
  ]
})

watch(() => props.visible, (val) => {
  if (val) {
    rejectForm.rejectStepId = ''
    rejectForm.rejectReason = ''
  }
})

function handleClose () {
  rejectFormRef.value?.clearValidate()
}

function handleCancel () {
  emit('update:visible', false)
}

async function handleConfirm () {
  const valid = await new Promise((resolve) => {
    rejectFormRef.value?.validate((v) => resolve(!!v))
  })
  if (!valid) return

  emit('confirm', {
    rejectStepId: rejectForm.rejectStepId,
    rejectReason: rejectForm.rejectReason
  })
  emit('update:visible', false)
}
</script>

<style scoped>
.modal-penetrable :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.25);
}

.reject-step-select {
  width: 100%;
  max-width: 100%;
}

.reject-step-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
}

.reject-step-option-name {
  flex-shrink: 0;
}

.reject-step-option-reviewers {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.reject-reason-input {
  width: 100%;
}
</style>
