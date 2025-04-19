<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-header">
        <div class="register-avatar">
          <img :src="getImageUrl('avatar.jpg')" alt="avatar" class="avatar-img">
        </div>
        <h2 class="register-title">
          创建账号
        </h2>
        <p class="register-subtitle">
          欢迎加入我们 (｡･ω･｡)ﾉ
        </p>
      </div>

      <div class="register-form-box">
        <van-form @submit="handleRegister">
          <van-cell-group inset>
            <van-field
              v-model="registerForm.username"
              class="username-field"
              name="username"
              placeholder="请输入用户名"
              :rules="usernameRules"
            >
              <template #left-icon>
                <van-icon name="user" class="field-icon" />
              </template>
            </van-field>
            <van-field
              v-model="registerForm.password"
              type="password"
              class="password-field"
              name="password"
              placeholder="请输入密码"
              :rules="passwordRules"
            >
              <template #left-icon>
                <van-icon name="lock" class="field-icon" />
              </template>
            </van-field>
            <van-field
              v-model="registerForm.confirmPassword"
              type="password"
              class="confirm-password-field"
              name="confirmPassword"
              placeholder="请确认密码"
              :rules="confirmPasswordRules"
            >
              <template #left-icon>
                <van-icon name="checked" class="field-icon" />
              </template>
            </van-field>
          </van-cell-group>

          <div class="register-btn-wrap">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              class="register-btn"
            >
              注册账号 (◕ᴗ◕✿)
            </van-button>
            <div class="login-link">
              已有账号？<router-link replace to="/login" class="link">
                去登录
              </router-link>
            </div>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FieldRule } from 'vant'
import { useAuthStore } from '@/store/auth'
import { getImageUrl } from '@/utils/common'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const usernameRules: FieldRule[] = [
  { required: true, message: '请输入用户名' },
  { pattern: /^[a-z0-9]{6,20}$/i, message: '用户名只能包含英文和数字，长度6-20位' },
]

const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^.{6,20}$/, message: '密码长度在6-20位之间' },
]

const confirmPasswordRules = computed<FieldRule[]>(() => [
  { required: true, message: '请确认密码' },
  {
    validator: (value) => {
      return value === registerForm.password
    },
    message: '两次输入的密码不一致',
  },
])

async function handleRegister() {
  loading.value = true
  try {
    const success = await authStore.registerAction({
      username: registerForm.username,
      password: registerForm.password,
    })
    if (success) {
      showToast('注册成功')
      router.replace('/login')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100%;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

.register-content {
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.register-header {
  padding: 10% 0 8%;
  text-align: center;
  flex-shrink: 1;
}

.register-avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 20px;
  background: #fff;
  border-radius: 55px;
  padding: 4px;
  box-shadow: 0 8px 20px rgba(64, 128, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.register-title {
  font-size: 32px;
  color: #4a90e2;
  margin: 0;
  font-weight: 600;
}

.register-subtitle {
  font-size: 16px;
  color: #8b8b8b;
  margin: 12px 0 0;
}

.register-form-box {
  margin-top: 20px;
  flex-shrink: 0;
}

:deep(.van-cell-group--inset) {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(64, 128, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

:deep(.van-field) {
  padding: 14px 16px;

  .van-field__left-icon {
    margin-right: 12px;
    font-size: 20px;
    color: #4a90e2;
    transition: transform 0.3s;
  }

  &:focus-within {
    .van-field__left-icon {
      transform: scale(1.1);
    }
  }

  .van-field__control {
    font-size: 16px;
    color: #333;

    &::placeholder {
      color: #bbb;
      font-size: 16px;
    }
  }
}

.username-field {
  margin-bottom: 10px;
}

.password-field {
  margin: 10px 0;
}

.confirm-password-field {
  margin-top: 10px;
}

.register-btn-wrap {
  margin-top: 28px;
  padding: 0 12px;
}

.register-btn {
  height: 46px;
  font-size: 18px;
  font-weight: 500;
  background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
  border: none;
  border-radius: 23px;
  box-shadow: 0 8px 15px rgba(64, 128, 255, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 4px 8px rgba(64, 128, 255, 0.2);
  }
}

.login-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;

  .link {
    color: #4a90e2;
    text-decoration: none;
    margin-left: 4px;

    &:active {
      opacity: 0.8;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

// 当键盘弹出时应用的样式
@media screen and (max-height: 480px) {
  .register-header {
    padding: 5% 0 4%;
  }

  .register-avatar {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
    padding: 5px;
    animation: none;
  }

  .register-title {
    font-size: 24px;
  }

  .register-subtitle {
    font-size: 14px;
    margin: 8px 0 0;
  }

  .register-form-box {
    margin-top: 10px;
  }

  .register-btn-wrap {
    margin-top: 20px;
  }

  .register-btn {
    height: 42px;
    font-size: 16px;
  }

  .login-link {
    margin-top: 12px;
  }
}
</style>
