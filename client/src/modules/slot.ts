@Component('SpinHandle')
export class SpinHandle {
    active: boolean = false
    reverse: boolean = false
    running: boolean = false
    fraction: number = 0
    speed: number = 120
    downpos: Vector3
    uppos: Vector3
    direction: Vector3 = Vector3.Backward()
}

@Component("SpinWheel")
export class SpinWheel {
    active: boolean = false;
    reverse: boolean = false;
    fraction: number = 0;
    speed: number = 120;
    direction: Vector3 = Vector3.Forward();
    stopAt: boolean | number = false;
}

const handles = engine.getComponentGroup(SpinHandle)
const wheels = engine.getComponentGroup(SpinWheel);

export class HandleSystem implements ISystem {
  update(dt: number) {
      // iterate over the wheels in the component group
      for (let handle of handles.entities) {
          // handy shortcuts
          let spin = handle.get(SpinHandle)
          let transform = handle.get(Transform)
          // check state
          if (spin.active) {
            transform.rotate(spin.direction, spin.speed * dt)
            if (spin.reverse == false && transform.rotation.eulerAngles.z < 300) {
                spin.reverse = true;
                spin.speed = 200;
                spin.direction = Vector3.Forward();
              }
              if (spin.reverse == true && (transform.rotation.eulerAngles.z > 355 || transform.rotation.eulerAngles.z < 20)) {
                spin.reverse = false;
                spin.active = false;
                spin.speed = 120;
                spin.direction = Vector3.Backward();
                transform.rotation.eulerAngles = new Vector3(0,0,0)
              }
            }
      }
  }
}

export class WheelSystem implements ISystem {

  value: boolean | number;

  constructor(){
    this.value = false;
  }

  update(dt: number) {
      // iterate over the wheels in the component group
      for (let wheel of wheels.entities) {
          // handy shortcuts
            let spin = wheel.get(SpinWheel)
            let transform = wheel.get(Transform)

            if(spin.stopAt != this.value) this.value = spin.stopAt;

            // check state
            if (spin.active) {
                transform.rotate(spin.direction, spin.speed * dt);
                if(this.value !== false){
                    if ((transform.rotation.eulerAngles.z > this.value * 36 + 15))
                    {
                        transform.rotation.eulerAngles = new Vector3(0, 0, (this.value * 36 + 10));
                        spin.active = false;
                        this.value = false;
                    }
                }
            }
      }
  }
}

engine.addSystem(new HandleSystem())
engine.addSystem(new WheelSystem())


export class Slot_Machine {
    core: Entity = new Entity;
    wheel_1: Entity = new Entity;
    wheel_2: Entity = new Entity;
    wheel_3: Entity = new Entity;
    buttom_1: Entity = new Entity;
    buttom_2: Entity = new Entity;
    buttom_3: Entity = new Entity;
    spin_handle: Entity = new Entity;

    position: Vector3;

    active: boolean = false;
    wheelsState: Array<number>
    size: number = 0.35;

    constructor(pos: Vector3, socket: WebSocket){
      this.position = pos;
      this.wheelsState = [0,0,0]
      this.build_shape()
      this.move()


      this.spin_handle.add(new SpinHandle())
      this.wheel_1.add(new SpinWheel());
      this.wheel_2.add(new SpinWheel());
      this.wheel_3.add(new SpinWheel());
      this.spin_handle.add(
          new OnClick(e => {
          socket.send("Slot Provably");
          let spin = this.spin_handle.get(SpinHandle)
              if (!this.active){
                  spin.active = true
                  this.active = true
              }
          this.wheel_1.get(SpinWheel).active = true;
          this.wheel_2.get(SpinWheel).active = true;
          this.wheel_3.get(SpinWheel).active = true;
          })
      )
    }

    setWheels(values: Array<number>){
      log(values)
        if(values.length !== 3) return;
        this.wheel_1.get(SpinWheel).stopAt = values[0];
        this.wheel_2.get(SpinWheel).stopAt = values[1];
        this.wheel_3.get(SpinWheel).stopAt = values[2];
    }

    build_shape(){
        this.core.add(new GLTFShape("models/Slot/SlotMachine.gltf"))
        this.wheel_1.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.wheel_2.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.wheel_3.add(new GLTFShape("models/Slot/wheel.gltf"))
        this.buttom_1.add(new GLTFShape("models/Slot/Buttom_01.gltf"))
        this.buttom_2.add(new GLTFShape("models/Slot/Buttom_02.gltf"))
        this.buttom_3.add(new GLTFShape("models/Slot/Buttom_03.gltf"))
        this.spin_handle.add(new GLTFShape("models/Slot/SpinHandle.gltf"))

        
    }

    move(){
      this.core.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      
      this.wheel_1.add(new Transform())
      this.wheel_2.add(new Transform())
      this.wheel_3.add(new Transform())

      this.spin_handle.add(new Transform())

      this.wheel_1.setParent(this.core)
      this.wheel_2.setParent(this.core)
      this.wheel_3.setParent(this.core)

      this.spin_handle.setParent(this.core)

      this.wheel_1.get(Transform).position.set(-0.13, 4.53, -0.86)
      this.wheel_2.get(Transform).position.set(-0.13, 4.53, 0)
      this.wheel_3.get(Transform).position.set(-0.13, 4.53, 0.86)
        this.wheel_1.get(Transform).rotation.eulerAngles = new Vector3(0, 0, 10)
        this.wheel_2.get(Transform).rotation.eulerAngles = new Vector3(0, 0, 10)
        this.wheel_3.get(Transform).rotation.eulerAngles = new Vector3(0, 0, 10)

      this.spin_handle.get(Transform).position.set(0, 4.33, 1.74)
      /*
      this.wheel_2.add(new Transform({
        position: new Vector3(this.position.x-0.05, this.position.y+1.582, this.position.z),
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.wheel_3.add(new Transform({
        position: new Vector3(this.position.x-0.05, this.position.y+1.582, this.position.z+0.3),
        scale: new Vector3(this.size, this.size, this.size)
      }))*/
      this.buttom_1.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.buttom_2.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
      this.buttom_3.add(new Transform({
        position: this.position,
        scale: new Vector3(this.size, this.size, this.size)
      }))
    /*
    this.spin_handle.set(new Transform({
        position: new Vector3(this.position.x, this.position.y+1.51, this.position.z+0.58),
        scale: new Vector3(this.size, this.size, this.size),
    }));*/
    }

    rotate(value: number){
      this.core.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_1.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_2.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.wheel_3.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_1.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_2.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      this.buttom_3.get(Transform).rotation = Quaternion.Euler(0, value, 0)
      //this.spin_handle.get(Transform).rotation = Quaternion.Euler(0, value, 0)
    }

    show(){
      
      engine.addEntity(this.core)
      engine.addEntity(this.wheel_1)
      engine.addEntity(this.wheel_2)
      engine.addEntity(this.wheel_3)
      engine.addEntity(this.buttom_1)
      engine.addEntity(this.buttom_2)
      engine.addEntity(this.buttom_3)
      engine.addEntity(this.spin_handle)

      
    }
}