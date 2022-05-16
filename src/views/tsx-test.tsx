import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const title = ref("test tsx config");

    return {
      title,
    };
  },
  render() {
    return (
      <div>
        <p>{this.title}</p>
      </div>
    );
  },
});
